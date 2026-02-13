<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="订单号">
        <el-input v-model="query.order_id" clearable style="width: 180px" />
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="query.user_id" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="银行类型">
        <el-select v-model="query.bank_type" clearable style="width: 100px">
          <el-option label="KBZ" value="kbz" />
          <el-option label="Wave" value="wave" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable style="width: 100px">
          <el-option label="待处理" :value="0" />
          <el-option label="成功" :value="1" />
          <el-option label="失败" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="order_id" label="订单号" width="180" />
      <el-table-column prop="user_id" label="用户ID" width="80" />
      <el-table-column prop="amount" label="提现金额" width="90">
        <template #default="{ row }">¥{{ row.amount }}</template>
      </el-table-column>
      <el-table-column prop="transfer_amount" label="转账金额" width="90">
        <template #default="{ row }">¥{{ row.transfer_amount }}</template>
      </el-table-column>
      <el-table-column prop="card_holder_name" label="持卡人" width="100" />
      <el-table-column prop="card_number" label="卡号" width="140" />
      <el-table-column prop="bank_type" label="银行" width="70" />
      <el-table-column prop="transaction_id" label="交易号" width="180" show-overflow-tooltip />
      <el-table-column prop="status_text" label="状态" width="70">
        <template #default="{ row }">
          <el-tag :type="{ 0: 'warning', 1: 'success', 2: 'danger' }[row.status]" size="small">{{ row.status_text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="150" show-overflow-tooltip />
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 0">
            <el-button link type="success" size="small" v-permission="'withdraw_order:approve'" @click="handleApprove(row)">通过</el-button>
            <el-button link type="danger" size="small" v-permission="'withdraw_order:reject'" @click="handleReject(row)">拒绝</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[20, 50, 100]" layout="total, sizes, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>

  <!-- 拒绝弹窗 -->
  <el-dialog v-model="rejectVisible" title="拒绝提现" width="400px">
    <el-form label-width="60px">
      <el-form-item label="备注">
        <el-input v-model="rejectRemark" type="textarea" rows="3" placeholder="拒绝原因（选填）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="rejectVisible = false">取消</el-button>
      <el-button type="danger" @click="submitReject">确定拒绝</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getWithdrawOrders, approveWithdraw, rejectWithdraw } from '@/api/withdraw'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const query = ref({ page: 1, page_size: 20, order_id: '', user_id: '', bank_type: '', status: null })
const rejectVisible = ref(false)
const rejectRemark = ref('')
const rejectOrderId = ref('')

async function fetchData() {
  loading.value = true
  try {
    const params = {}
    Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    const res = await getWithdrawOrders(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {} finally { loading.value = false }
}

function resetQuery() {
  query.value = { page: 1, page_size: 20, order_id: '', user_id: '', bank_type: '', status: null }
  fetchData()
}

async function handleApprove(row) {
  await ElMessageBox.confirm(`确定通过提现订单 ${row.order_id}？`, '审核通过', { type: 'warning' })
  await approveWithdraw(row.order_id)
  ElMessage.success('审核通过'); fetchData()
}

function handleReject(row) {
  rejectOrderId.value = row.order_id
  rejectRemark.value = ''
  rejectVisible.value = true
}

async function submitReject() {
  await rejectWithdraw(rejectOrderId.value, { remark: rejectRemark.value })
  ElMessage.success('已拒绝并退还余额'); rejectVisible.value = false; fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.search-form { margin-bottom: 16px; }
</style>
