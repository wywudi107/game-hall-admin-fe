<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="用户ID"><el-input v-model="query.user_id" clearable style="width: 120px" /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable style="width: 100px">
          <el-option label="待确定" :value="0" /><el-option label="成功" :value="1" /><el-option label="失败" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button></el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="order_id" label="订单号" width="180" />
      <el-table-column prop="user_id" label="用户ID" width="80" />
      <el-table-column prop="amount" label="金额" width="90"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
      <el-table-column prop="status_text" label="状态" width="80">
        <template #default="{ row }"><el-tag :type="{ 0: 'warning', 1: 'success', 2: 'danger' }[row.status]" size="small">{{ row.status_text }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="170" />
    </el-table>
    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[20, 50, 100]" layout="total, sizes, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGameWithdrawOrders } from '@/api/game-order'
const loading = ref(false), tableData = ref([]), total = ref(0)
const query = ref({ page: 1, page_size: 20, user_id: '', status: null })
async function fetchData() {
  loading.value = true
  try {
    const params = {}; Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    const res = await getGameWithdrawOrders(params); tableData.value = res.data.list; total.value = res.data.total
  } catch {} finally { loading.value = false }
}
onMounted(fetchData)
</script>
<style scoped>.search-form { margin-bottom: 16px; }</style>
