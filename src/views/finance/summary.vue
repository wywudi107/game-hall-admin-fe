<template>
  <el-card v-loading="loading">
    <el-descriptions title="资金汇总" :column="2" border>
      <el-descriptions-item label="充值成功总额">¥{{ data.total_recharge }}</el-descriptions-item>
      <el-descriptions-item label="提现成功总额">¥{{ data.total_withdraw }}</el-descriptions-item>
      <el-descriptions-item label="净充值">¥{{ data.net_recharge }}</el-descriptions-item>
      <el-descriptions-item label="手续费收入">¥{{ data.total_fee }}</el-descriptions-item>
      <el-descriptions-item label="用户总余额">¥{{ data.total_user_balance }}</el-descriptions-item>
      <el-descriptions-item label="用户锁定余额">¥{{ data.total_user_locked_balance }}</el-descriptions-item>
      <el-descriptions-item label="平台资金差额">
        <span :style="{ color: data.platform_diff >= 0 ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">¥{{ data.platform_diff }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFinanceSummary } from '@/api/finance'
const loading = ref(false)
const data = ref({})
onMounted(async () => {
  loading.value = true
  try { const res = await getFinanceSummary(); data.value = res.data } catch {} finally { loading.value = false }
})
</script>
