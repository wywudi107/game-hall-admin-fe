<template>
  <div v-loading="loading">
    <el-page-header @back="$router.back()" content="用户详情" style="margin-bottom: 20px" />

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card header="基本信息">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ user.username || '-' }}</el-descriptions-item>
            <el-descriptions-item label="设备UID">{{ user.uid }}</el-descriptions-item>
            <el-descriptions-item label="余额">¥{{ user.balance }}</el-descriptions-item>
            <el-descriptions-item label="锁定余额">¥{{ user.locked_balance }}</el-descriptions-item>
            <el-descriptions-item label="VIP等级">{{ user.vip }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="user.status === 1 ? 'success' : 'danger'" size="small">{{ user.status === 1 ? '正常' : '封禁' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="渠道">{{ user.channel_code || '-' }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ user.created_at }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="银行卡信息">
          <el-descriptions :column="1" border v-if="bankCard">
            <el-descriptions-item label="持卡人">{{ bankCard.card_holder_name }}</el-descriptions-item>
            <el-descriptions-item label="卡号">{{ bankCard.card_number }}</el-descriptions-item>
            <el-descriptions-item label="银行类型">{{ bankCard.bank_type }}</el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="未绑定银行卡" :image-size="60" />
        </el-card>
        <el-card header="统计信息" style="margin-top: 16px">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="累计充值">¥{{ userStats.total_recharge }}</el-descriptions-item>
            <el-descriptions-item label="累计提现">¥{{ userStats.total_withdraw }}</el-descriptions-item>
            <el-descriptions-item label="总洗码量">¥{{ userStats.total_bet_money }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUserDetail } from '@/api/user'

const route = useRoute()
const loading = ref(false)
const user = ref({})
const bankCard = ref(null)
const userStats = ref({})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getUserDetail(route.params.id)
    user.value = res.data.user
    bankCard.value = res.data.bank_card
    userStats.value = res.data.stats
  } catch {} finally { loading.value = false }
})
</script>
