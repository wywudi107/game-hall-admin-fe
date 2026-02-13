<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="管理员ID"><el-input v-model="query.admin_id" clearable style="width: 100px" /></el-form-item>
      <el-form-item label="模块">
        <el-select v-model="query.module" clearable style="width: 120px">
          <el-option label="用户" value="user" /><el-option label="订单" value="order" />
          <el-option label="游戏" value="game" /><el-option label="字典" value="dictionary" />
          <el-option label="银行卡" value="bank_card" /><el-option label="系统" value="system" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker v-model="dateRange" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          start-placeholder="开始" end-placeholder="结束" style="width: 240px" />
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button></el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="admin_username" label="管理员" width="100" />
      <el-table-column prop="module" label="模块" width="80" />
      <el-table-column prop="action" label="操作" width="150" />
      <el-table-column prop="target_id" label="对象ID" width="100" />
      <el-table-column prop="detail" label="详情" min-width="250" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP" width="130" />
      <el-table-column prop="created_at" label="时间" width="170" />
    </el-table>

    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[20, 50, 100]" layout="total, sizes, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOperationLogs } from '@/api/admin'
const loading = ref(false), tableData = ref([]), total = ref(0), dateRange = ref(null)
const query = ref({ page: 1, page_size: 20, admin_id: '', module: '' })
async function fetchData() {
  loading.value = true
  try {
    const params = {}; Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    if (dateRange.value) { params.start_date = dateRange.value[0]; params.end_date = dateRange.value[1] }
    const res = await getOperationLogs(params); tableData.value = res.data.list; total.value = res.data.total
  } catch {} finally { loading.value = false }
}
onMounted(fetchData)
</script>
<style scoped>.search-form { margin-bottom: 16px; }</style>
