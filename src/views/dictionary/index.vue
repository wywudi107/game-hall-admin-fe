<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="字典类型"><el-input v-model="query.dict_type" clearable style="width: 150px" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="success" v-permission="'dictionary:edit'" @click="showCreateDialog">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="dict_type" label="类型" width="120" />
      <el-table-column prop="dict_key" label="键" width="120" />
      <el-table-column prop="dict_value" label="值" min-width="200" show-overflow-tooltip />
      <el-table-column prop="sort_order" label="排序" width="70" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" v-permission="'dictionary:edit'" @click="showEditDialog(row)">编辑</el-button>
          <el-button link type="danger" size="small" v-permission="'dictionary:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[50, 100, 200]" layout="total, sizes, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑字典' : '新增字典'" width="500px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="类型"><el-input v-model="form.dict_type" :disabled="isEdit" /></el-form-item>
      <el-form-item label="键"><el-input v-model="form.dict_key" :disabled="isEdit" /></el-form-item>
      <el-form-item label="值"><el-input v-model="form.dict_value" type="textarea" rows="3" /></el-form-item>
      <el-form-item label="排序"><el-input-number v-model="form.sort_order" :min="0" /></el-form-item>
      <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDictionaries, createDictionary, updateDictionary, deleteDictionary } from '@/api/dictionary'

const loading = ref(false), tableData = ref([]), total = ref(0)
const query = ref({ page: 1, page_size: 50, dict_type: '' })
const dialogVisible = ref(false), isEdit = ref(false)
const form = ref({ dict_type: '', dict_key: '', dict_value: '', sort_order: 0, status: 1, remark: '' })
let editId = null

async function fetchData() {
  loading.value = true
  try {
    const params = {}; Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    const res = await getDictionaries(params); tableData.value = res.data.list; total.value = res.data.total
  } catch {} finally { loading.value = false }
}

function showCreateDialog() {
  isEdit.value = false; editId = null
  form.value = { dict_type: '', dict_key: '', dict_value: '', sort_order: 0, status: 1, remark: '' }
  dialogVisible.value = true
}
function showEditDialog(row) {
  isEdit.value = true; editId = row.id
  form.value = { dict_type: row.dict_type, dict_key: row.dict_key, dict_value: row.dict_value, sort_order: row.sort_order, status: row.status, remark: row.remark || '' }
  dialogVisible.value = true
}
async function submitForm() {
  if (isEdit.value) {
    await updateDictionary(editId, { dict_value: form.value.dict_value, sort_order: form.value.sort_order, status: form.value.status, remark: form.value.remark })
  } else {
    await createDictionary(form.value)
  }
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功'); dialogVisible.value = false; fetchData()
}
async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除字典项 ${row.dict_key}？`, '删除确认', { type: 'warning' })
  await deleteDictionary(row.id); ElMessage.success('删除成功'); fetchData()
}
onMounted(fetchData)
</script>
<style scoped>.search-form { margin-bottom: 16px; }</style>
