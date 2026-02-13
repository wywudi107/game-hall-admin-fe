<template>
  <el-card>
    <!-- 搜索 -->
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="用户ID">
        <el-input v-model="query.user_id" placeholder="精确搜索" clearable style="width: 130px" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="query.username" placeholder="模糊搜索" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" placeholder="全部" clearable style="width: 100px">
          <el-option label="正常" :value="1" />
          <el-option label="封禁" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="uid" label="设备UID" min-width="150" show-overflow-tooltip />
      <el-table-column prop="balance" label="余额" width="100">
        <template #default="{ row }">¥{{ row.balance }}</template>
      </el-table-column>
      <el-table-column prop="vip" label="VIP" width="60" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
            {{ row.status === 1 ? '正常' : '封禁' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="channel_code" label="渠道" width="100" />
      <el-table-column prop="created_at" label="注册时间" width="170" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="$router.push(`/user/${row.id}`)">详情</el-button>
          <el-button link :type="row.status === 1 ? 'danger' : 'success'" size="small" v-permission="'user:ban'" @click="toggleStatus(row)">
            {{ row.status === 1 ? '封禁' : '解封' }}
          </el-button>
          <el-dropdown v-permission="'user:edit'" trigger="click">
            <el-button link type="primary" size="small">更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showVipDialog(row)">修改VIP</el-dropdown-item>
                <el-dropdown-item @click="showBalanceDialog(row)">调整余额</el-dropdown-item>
                <el-dropdown-item @click="showPasswordDialog(row)">重置密码</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.page_size"
      :total="total"
      :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      style="margin-top: 16px"
      @change="fetchData"
    />
  </el-card>

  <!-- VIP 弹窗 -->
  <el-dialog v-model="vipVisible" title="修改VIP等级" width="360px">
    <el-form label-width="60px">
      <el-form-item label="VIP">
        <el-input-number v-model="vipForm.vip" :min="0" :max="10" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="vipVisible = false">取消</el-button>
      <el-button type="primary" @click="submitVip">确定</el-button>
    </template>
  </el-dialog>

  <!-- 余额弹窗 -->
  <el-dialog v-model="balanceVisible" title="调整余额" width="400px">
    <el-form label-width="80px">
      <el-form-item label="调整金额">
        <el-input-number v-model="balanceForm.amount" :precision="2" :step="100" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="balanceForm.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="balanceVisible = false">取消</el-button>
      <el-button type="primary" @click="submitBalance">确定</el-button>
    </template>
  </el-dialog>

  <!-- 密码弹窗 -->
  <el-dialog v-model="pwdVisible" title="重置密码" width="360px">
    <el-form label-width="70px">
      <el-form-item label="新密码">
        <el-input v-model="pwdForm.new_password" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="pwdVisible = false">取消</el-button>
      <el-button type="primary" @click="submitPassword">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, updateUserStatus, updateUserVip, adjustBalance, resetPassword } from '@/api/user'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const query = ref({ page: 1, page_size: 20, user_id: '', username: '', status: null })

const vipVisible = ref(false)
const vipForm = ref({ userId: null, vip: 0 })
const balanceVisible = ref(false)
const balanceForm = ref({ userId: null, amount: 0, remark: '' })
const pwdVisible = ref(false)
const pwdForm = ref({ userId: null, new_password: '' })

async function fetchData() {
  loading.value = true
  try {
    const params = { ...query.value }
    if (!params.user_id) delete params.user_id
    if (!params.username) delete params.username
    if (params.status === null) delete params.status
    const res = await getUsers(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {} finally { loading.value = false }
}

function resetQuery() {
  query.value = { page: 1, page_size: 20, user_id: '', username: '', status: null }
  fetchData()
}

async function toggleStatus(row) {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 0 ? '封禁' : '解封'
  await ElMessageBox.confirm(`确定${action}用户 ${row.id}？`, '提示', { type: 'warning' })
  await updateUserStatus(row.id, { status: newStatus })
  ElMessage.success(`${action}成功`)
  fetchData()
}

function showVipDialog(row) { vipForm.value = { userId: row.id, vip: row.vip }; vipVisible.value = true }
function showBalanceDialog(row) { balanceForm.value = { userId: row.id, amount: 0, remark: '' }; balanceVisible.value = true }
function showPasswordDialog(row) { pwdForm.value = { userId: row.id, new_password: '' }; pwdVisible.value = true }

async function submitVip() {
  await updateUserVip(vipForm.value.userId, { vip: vipForm.value.vip })
  ElMessage.success('修改成功'); vipVisible.value = false; fetchData()
}
async function submitBalance() {
  await adjustBalance(balanceForm.value.userId, { amount: balanceForm.value.amount, remark: balanceForm.value.remark })
  ElMessage.success('调整成功'); balanceVisible.value = false; fetchData()
}
async function submitPassword() {
  if (pwdForm.value.new_password.length < 6) { ElMessage.warning('密码不能少于6位'); return }
  await resetPassword(pwdForm.value.userId, { new_password: pwdForm.value.new_password })
  ElMessage.success('重置成功'); pwdVisible.value = false
}

onMounted(fetchData)
</script>

<style scoped>
.search-form { margin-bottom: 16px; }
</style>
