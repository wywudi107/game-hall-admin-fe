import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const Layout = () => import('@/layout/index.vue')

// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/403',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
]

// 动态路由（根据权限过滤）
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer', permission: 'dashboard:view' },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'User', permission: 'user:view' },
    children: [
      {
        path: '',
        name: 'UserList',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户列表', permission: 'user:view' },
      },
      {
        path: ':id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail.vue'),
        meta: { title: '用户详情', hidden: true, permission: 'user:view' },
      },
      {
        path: 'retention',
        name: 'RetentionReport',
        component: () => import('@/views/finance/retention.vue'),
        meta: { title: '用户留存', permission: 'user:view' },
      },
    ],
  },
  {
    path: '/recharge',
    component: Layout,
    meta: { title: '充值订单', icon: 'Wallet', permission: 'recharge_order:view' },
    children: [
      {
        path: '',
        name: 'RechargeList',
        component: () => import('@/views/recharge/index.vue'),
        meta: { title: '充值订单列表', permission: 'recharge_order:view' },
      },
    ],
  },
  {
    path: '/withdraw',
    component: Layout,
    meta: { title: '提现订单', icon: 'Money', permission: 'withdraw_order:view' },
    children: [
      {
        path: '',
        name: 'WithdrawList',
        component: () => import('@/views/withdraw/index.vue'),
        meta: { title: '提现订单列表', permission: 'withdraw_order:view' },
      },
    ],
  },
  {
    path: '/game',
    component: Layout,
    meta: { title: '游戏管理', icon: 'Monitor', permission: 'game:view' },
    children: [
      {
        path: '',
        name: 'GameList',
        component: () => import('@/views/game/index.vue'),
        meta: { title: '游戏列表', permission: 'game:view' },
      },
    ],
  },
  {
    path: '/game-order',
    component: Layout,
    meta: { title: '游戏订单', icon: 'List', permission: 'game_order:view' },
    children: [
      {
        path: 'deposit',
        name: 'DepositOrders',
        component: () => import('@/views/game-order/deposit.vue'),
        meta: { title: '上分订单', permission: 'game_order:view' },
      },
      {
        path: 'withdraw-game',
        name: 'GameWithdrawOrders',
        component: () => import('@/views/game-order/withdraw.vue'),
        meta: { title: '下分订单', permission: 'game_order:view' },
      },
    ],
  },
  {
    path: '/finance',
    component: Layout,
    meta: { title: '财务统计', icon: 'TrendCharts', permission: 'finance:view' },
    children: [
      {
        path: 'daily-report',
        name: 'DailyReport',
        component: () => import('@/views/finance/daily-report.vue'),
        meta: { title: '日报表', permission: 'finance:view' },
      },
    ],
  },
  {
    path: '/dictionary',
    component: Layout,
    meta: { title: '字典管理', icon: 'Notebook', permission: 'dictionary:view' },
    children: [
      {
        path: '',
        name: 'DictionaryList',
        component: () => import('@/views/dictionary/index.vue'),
        meta: { title: '字典列表', permission: 'dictionary:view' },
      },
    ],
  },
  {
    path: '/bank-card',
    component: Layout,
    meta: { title: '银行卡管理', icon: 'CreditCard', permission: 'bank_card:view' },
    children: [
      {
        path: '',
        name: 'BankCardList',
        component: () => import('@/views/bank-card/index.vue'),
        meta: { title: '银行卡列表', permission: 'bank_card:view' },
      },
    ],
  },
  {
    path: '/admin',
    component: Layout,
    meta: { title: '系统管理', icon: 'Setting', permission: 'admin_user:view' },
    children: [
      {
        path: 'admins',
        name: 'AdminList',
        component: () => import('@/views/admin/admins.vue'),
        meta: { title: '管理员管理', permission: 'admin_user:view' },
      },
      {
        path: 'roles',
        name: 'RoleList',
        component: () => import('@/views/admin/roles.vue'),
        meta: { title: '角色管理', permission: 'admin_role:view' },
      },
      {
        path: 'logs',
        name: 'OperationLogs',
        component: () => import('@/views/log/index.vue'),
        meta: { title: '操作日志', permission: 'operation_log:view' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes],
})

// 查找用户有权限的第一个路由路径
function findFirstAccessibleRoute(userStore) {
  for (const route of asyncRoutes) {
    if (!route.children || route.children.length === 0) continue
    for (const child of route.children) {
      const perm = child.meta?.permission
      if (perm && userStore.hasPermission(perm) && !child.meta?.hidden) {
        const childPath = child.path || ''
        if (route.path === '/') return `/${childPath}`
        return childPath ? `${route.path}/${childPath}` : route.path
      }
    }
  }
  return null
}

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.path === '/login') {
    if (userStore.token) {
      next('/')
    } else {
      next()
    }
    return
  }

  if (!userStore.token) {
    next('/login')
    return
  }

  // 权限校验
  const requiredPerm = to.meta?.permission
  if (requiredPerm && !userStore.hasPermission(requiredPerm)) {
    // 如果是从登录或根路径进来的，尝试跳到有权限的第一个页面
    if (to.path === '/dashboard' || to.path === '/') {
      const firstRoute = findFirstAccessibleRoute(userStore)
      if (firstRoute) {
        next(firstRoute)
        return
      }
    }
    next('/403')
    return
  }

  next()
})

export default router
