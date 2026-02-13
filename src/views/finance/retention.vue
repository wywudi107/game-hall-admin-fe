<template>
  <el-card>
    <template #header>
      <span>用户留存统计</span>
    </template>
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="reg_date" label="注册日期" width="120" />
      <el-table-column prop="reg_count" label="注册人数" width="90" align="center" />
      <el-table-column label="次日留存(D1)" align="center" min-width="120">
        <template #default="{ row }">
          <template v-if="row.d1 !== null">
            {{ row.d1 }}人 <span class="rate">({{ row.d1_rate }}%)</span>
          </template>
          <span v-else class="pending">-</span>
        </template>
      </el-table-column>
      <el-table-column label="3日留存(D3)" align="center" min-width="120">
        <template #default="{ row }">
          <template v-if="row.d3 !== null">
            {{ row.d3 }}人 <span class="rate">({{ row.d3_rate }}%)</span>
          </template>
          <span v-else class="pending">-</span>
        </template>
      </el-table-column>
      <el-table-column label="7日留存(D7)" align="center" min-width="120">
        <template #default="{ row }">
          <template v-if="row.d7 !== null">
            {{ row.d7 }}人 <span class="rate">({{ row.d7_rate }}%)</span>
          </template>
          <span v-else class="pending">-</span>
        </template>
      </el-table-column>
      <el-table-column label="14日留存(D14)" align="center" min-width="120">
        <template #default="{ row }">
          <template v-if="row.d14 !== null">
            {{ row.d14 }}人 <span class="rate">({{ row.d14_rate }}%)</span>
          </template>
          <span v-else class="pending">-</span>
        </template>
      </el-table-column>
      <el-table-column label="30日留存(D30)" align="center" min-width="120">
        <template #default="{ row }">
          <template v-if="row.d30 !== null">
            {{ row.d30 }}人 <span class="rate">({{ row.d30_rate }}%)</span>
          </template>
          <span v-else class="pending">-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @current-change="fetchData"
      @size-change="fetchData"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRetentionReport, refreshRetention } from '@/api/finance'

const loading = ref(false)
const refreshing = ref(false)
const tableData = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

async function fetchData() {
  loading.value = true
  try {
    const res = await getRetentionReport({ page: page.value, page_size: pageSize.value })
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {} finally { loading.value = false }
}

async function handleRefresh() {
  refreshing.value = true
  try {
    await refreshRetention()
    ElMessage.success('统计任务已触发，约1分钟后刷新页面查看')
  } catch {} finally { refreshing.value = false }
}

onMounted(fetchData)
</script>

<style scoped>
.rate { color: #409eff; font-size: 12px; }
.pending { color: #c0c4cc; }
</style>
