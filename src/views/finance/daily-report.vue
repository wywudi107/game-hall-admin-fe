<template>
  <el-card>
    <template #header>
      <span>日报表</span>
    </template>
    <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="report_date" label="日期" width="120" fixed />
      <el-table-column label="充值金额" width="120" align="right">
        <template #default="{ row }">{{ row.recharge_amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="提现金额" width="120" align="right">
        <template #default="{ row }">{{ row.withdraw_amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="reg_count" label="注册人数" width="100" align="right" />
      <el-table-column prop="first_recharge_count" label="首充人数" width="100" align="right" />
      <el-table-column label="首充金额" width="120" align="right">
        <template #default="{ row }">{{ row.first_recharge_amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="首充转化率" width="110" align="right">
        <template #default="{ row }">
          {{ row.reg_count > 0 ? (row.first_recharge_count / row.reg_count * 100).toFixed(1) + '%' : '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="new_user_recharge_count" label="新用户充值人数" width="130" align="right" />
      <el-table-column prop="recharge_user_count" label="充值玩家数" width="110" align="right" />
      <el-table-column prop="bet_user_count" label="押注人数" width="100" align="right" />
      <el-table-column label="押注金额" width="120" align="right">
        <template #default="{ row }">{{ row.bet_amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="付费玩家流失率" width="130" align="right">
        <template #default>—</template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="fetchData"
        @size-change="fetchData"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDailyReport } from '@/api/finance'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

async function fetchData() {
  loading.value = true
  try {
    const res = await getDailyReport({ page: page.value, page_size: pageSize.value })
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    ElMessage.error('获取日报表失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
