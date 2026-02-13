<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="用户ID"><el-input v-model="query.user_id" clearable style="width: 120px" /></el-form-item>
      <el-form-item label="持卡人"><el-input v-model="query.card_holder_name" clearable style="width: 150px" /></el-form-item>
      <el-form-item label="银行类型">
        <el-select v-model="query.bank_type" clearable style="width: 100px">
          <el-option label="KBZ" value="kbz" /><el-option label="Wave" value="wave" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button></el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="user_id" label="用户ID" width="80" />
      <el-table-column prop="card_holder_name" label="持卡人" width="120" />
      <el-table-column prop="card_number" label="卡号" width="180" />
      <el-table-column prop="bank_type" label="银行类型" width="90" />
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="danger" size="small" v-permission="'bank_card:unbind'" @click="handleDelete(row)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[20, 50, 100]" layout="total, sizes, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBankCards, deleteBankCard } from '@/api/bank-card'
const loading = ref(false), tableData = ref([]), total = ref(0)
const query = ref({ page: 1, page_size: 20, user_id: '', card_holder_name: '', bank_type: '' })
async function fetchData() {
  loading.value = true
  try {
    const params = {}; Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    const res = await getBankCards(params); tableData.value = res.data.list; total.value = res.data.total
  } catch {} finally { loading.value = false }
}
async function handleDelete(row) {
  await ElMessageBox.confirm(`确定解绑用户 ${row.user_id} 的银行卡？`, '解绑确认', { type: 'warning' })
  await deleteBankCard(row.id); ElMessage.success('解绑成功'); fetchData()
}
onMounted(fetchData)
</script>
<style scoped>.search-form { margin-bottom: 16px; }</style>
