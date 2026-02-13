<template>
  <el-card>
    <div style="margin-bottom: 16px">
      <el-button type="primary" v-permission="'admin_user:create'" @click="showCreateDialog">新增管理员</el-button>
    </div>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="账号" width="120" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="role_name" label="角色" width="120" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="last_login_at" label="最后登录" width="170" />
      <el-table-column prop="last_login_ip" label="登录IP" width="130" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" v-permission="'admin_user:edit'" @click="showEditDialog(row)">编辑</el-button>
          <el-button link type="danger" size="small" v-permission="'admin_user:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[20, 50]" layout="total, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑管理员' : '新增管理员'" width="450px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="账号"><el-input v-model="form.username" :disabled="isEdit" /></el-form-item>
      <el-form-item label="密码" v-if="!isEdit"><el-input v-model="form.password" type="password" show-password /></el-form-item>
      <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role_id" style="width: 100%">
          <el-option v-for="r in roles" :key="r.id" :label="r.role_name" :value="r.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" v-if="isEdit">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="重置密码" v-if="isEdit">
        <el-input v-model="form.password" placeholder="留空则不修改" type="password" show-password />
      </el-form-item>
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
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, getRoles } from '@/api/admin'

const loading = ref(false), tableData = ref([]), total = ref(0), roles = ref([])
const query = ref({ page: 1, page_size: 20 })
const dialogVisible = ref(false), isEdit = ref(false)
const form = ref({ username: '', password: '', nickname: '', role_id: null, status: 1 })
let editId = null

async function fetchData() {
  loading.value = true
  try {
    const res = await getAdmins(query.value); tableData.value = res.data.list; total.value = res.data.total
  } catch {} finally { loading.value = false }
}
async function loadRoles() {
  try { const res = await getRoles(); roles.value = res.data } catch {}
}

function showCreateDialog() {
  isEdit.value = false; editId = null
  form.value = { username: '', password: '', nickname: '', role_id: null, status: 1 }
  dialogVisible.value = true
}
function showEditDialog(row) {
  isEdit.value = true; editId = row.id
  form.value = { username: row.username, password: '', nickname: row.nickname, role_id: row.role_id, status: row.status }
  dialogVisible.value = true
}
async function submitForm() {
  if (isEdit.value) {
    const data = { nickname: form.value.nickname, role_id: form.value.role_id, status: form.value.status }
    if (form.value.password) data.password = form.value.password
    await updateAdmin(editId, data)
  } else {
    await createAdmin(form.value)
  }
  ElMessage.success(isEdit.value ? '修改成功' : '创建成功'); dialogVisible.value = false; fetchData()
}
async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除管理员 ${row.username}？`, '删除确认', { type: 'warning' })
  await deleteAdmin(row.id); ElMessage.success('删除成功'); fetchData()
}

onMounted(() => { fetchData(); loadRoles() })
</script>
