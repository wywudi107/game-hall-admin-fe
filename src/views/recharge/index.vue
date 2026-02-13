<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="订单号">
        <el-input v-model="query.order_id" clearable style="width: 180px" />
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="query.user_id" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="query.payment_type" clearable style="width: 100px">
          <el-option label="KBZ" value="kbz" />
          <el-option label="Wave" value="wave" />
        </el-select>
      </el-form-item>
      <el-form-item label="后5位码">
        <el-input v-model="query.verification_code" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable style="width: 100px">
          <el-option label="待支付" :value="0" />
          <el-option label="已完成" :value="1" />
          <el-option label="已取消" :value="2" />
          <el-option label="已退款" :value="3" />
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
      <el-table-column prop="amount" label="金额" width="90">
        <template #default="{ row }">¥{{ row.amount }}</template>
      </el-table-column>
      <el-table-column prop="actual_amount" label="实际金额" width="90">
        <template #default="{ row }">¥{{ row.actual_amount }}</template>
      </el-table-column>
      <el-table-column prop="payment_type" label="支付方式" width="80" />
      <el-table-column prop="verification_code" label="后5位码" width="90" />
      <el-table-column prop="transaction_id" label="交易号" width="180" show-overflow-tooltip />
      <el-table-column prop="account_no" label="账号" width="140" show-overflow-tooltip />
      <el-table-column prop="status_text" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="{ 0: 'warning', 1: 'success', 2: 'info', 3: 'danger' }[row.status]" size="small">{{ row.status_text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="150" show-overflow-tooltip />
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 0">
            <el-button link type="primary" size="small" v-permission="'recharge_order:manual_recharge'" @click="handleManual(row)">补单</el-button>
            <el-button link type="danger" size="small" v-permission="'recharge_order:cancel'" @click="handleCancel(row)">取消</el-button>
          </template>
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
import { getRechargeOrders, manualRecharge, cancelRechargeOrder } from '@/api/recharge'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const query = ref({ page: 1, page_size: 20, order_id: '', user_id: '', payment_type: '', verification_code: '', status: null })

async function fetchData() {
  loading.value = true
  try {
    const params = {}
    Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    const res = await getRechargeOrders(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {} finally { loading.value = false }
}

function resetQuery() {
  query.value = { page: 1, page_size: 20, order_id: '', user_id: '', payment_type: '', verification_code: '', status: null }
  fetchData()
}

async function handleManual(row) {
  const { value: remark } = await ElMessageBox.prompt(`确定对订单 ${row.order_id} 执行人工补单？`, '人工补单', {
    type: 'warning',
    inputPlaceholder: '请输入备注信息',
    inputValue: '人工操作',
    inputValidator: (val) => {
      if (val && val.length > 255) return '备注信息不能超过255个字符'
      return true
    },
  })
  await manualRecharge({ order_id: row.order_id, remark: remark || '' })
  ElMessage.success('补单成功'); fetchData()
}

async function handleCancel(row) {
  const { value: remark } = await ElMessageBox.prompt(`确定取消订单 ${row.order_id}？`, '取消订单', {
    type: 'warning',
    inputPlaceholder: '请输入备注信息',
    inputValue: '人工操作',
    inputValidator: (val) => {
      if (val && val.length > 255) return '备注信息不能超过255个字符'
      return true
    },
  })
  await cancelRechargeOrder(row.order_id, remark || '')
  ElMessage.success('已取消'); fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.search-form { margin-bottom: 16px; }
</style>
