<template>
  <el-card>
    <el-form :inline="true" class="search-form">
      <el-form-item label="日期范围">
        <el-date-picker v-model="dateRange" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          start-placeholder="开始" end-placeholder="结束" style="width: 240px" />
      </el-form-item>
      <el-form-item label="维度">
        <el-select v-model="groupBy" style="width: 120px">
          <el-option label="按日期" value="date" /><el-option label="按支付方式" value="payment_type" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button></el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column :prop="groupBy === 'date' ? 'date' : 'payment_type'" :label="groupBy === 'date' ? '日期' : '支付方式'" width="150" />
      <el-table-column prop="count" label="笔数" width="80" />
      <el-table-column prop="amount" label="金额" width="120"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
      <el-table-column prop="user_count" label="用户数" width="80" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRechargeReport } from '@/api/finance'
const loading = ref(false), tableData = ref([]), dateRange = ref(null), groupBy = ref('date')
async function fetchData() {
  loading.value = true
  try {
    const params = { group_by: groupBy.value }
    if (dateRange.value) { params.start_date = dateRange.value[0]; params.end_date = dateRange.value[1] }
    const res = await getRechargeReport(params); tableData.value = res.data
  } catch {} finally { loading.value = false }
}
onMounted(fetchData)
</script>
<style scoped>.search-form { margin-bottom: 16px; }</style>
