<template>
  <el-card>
    <div style="margin-bottom: 16px">
      <el-button type="primary" v-permission="'admin_role:create'" @click="showCreateDialog">新增角色</el-button>
    </div>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="role_name" label="角色名称" width="120" />
      <el-table-column prop="role_key" label="角色标识" width="130" />
      <el-table-column prop="permissions" label="权限" min-width="300">
        <template #default="{ row }">
          <el-tag v-for="p in (row.permissions || []).slice(0, 5)" :key="p" size="small" style="margin: 2px">{{ p }}</el-tag>
          <el-tag v-if="(row.permissions || []).length > 5" size="small" type="info" style="margin: 2px">+{{ row.permissions.length - 5 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="70">
        <template #default="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" v-permission="'admin_role:edit'" @click="showEditDialog(row)">编辑</el-button>
          <el-button link type="danger" size="small" v-permission="'admin_role:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新增角色'" width="600px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="角色名称"><el-input v-model="form.role_name" /></el-form-item>
      <el-form-item label="角色标识"><el-input v-model="form.role_key" :disabled="isEdit" /></el-form-item>
      <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
      <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      <el-form-item label="权限">
        <el-checkbox-group v-model="form.permissions">
          <div v-for="(perms, module) in allPermissions" :key="module" style="margin-bottom: 8px">
            <div style="font-weight: bold; margin-bottom: 4px">{{ module }}</div>
            <el-checkbox v-for="p in perms" :key="p" :value="p" :label="p" />
          </div>
        </el-checkbox-group>
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
import { getRoles, createRole, updateRole, deleteRole } from '@/api/admin'

const loading = ref(false), tableData = ref([])
const dialogVisible = ref(false), isEdit = ref(false)
const form = ref({ role_name: '', role_key: '', permissions: [], status: 1, remark: '' })
let editId = null

const allPermissions = {
  dashboard: ['dashboard:view'],
  user: ['user:view', 'user:edit', 'user:ban', 'user:adjust_balance', 'user:reset_password'],
  recharge_order: ['recharge_order:view', 'recharge_order:manual_recharge', 'recharge_order:cancel'],
  withdraw_order: ['withdraw_order:view', 'withdraw_order:approve', 'withdraw_order:reject'],
  game: ['game:view', 'game:edit', 'game:toggle_status'],
  game_order: ['game_order:view'],
  finance: ['finance:view', 'finance:export'],
  dictionary: ['dictionary:view', 'dictionary:edit', 'dictionary:delete'],
  bank_card: ['bank_card:view', 'bank_card:unbind'],
  admin_user: ['admin_user:view', 'admin_user:create', 'admin_user:edit', 'admin_user:delete'],
  admin_role: ['admin_role:view', 'admin_role:create', 'admin_role:edit', 'admin_role:delete'],
  operation_log: ['operation_log:view'],
}

async function fetchData() {
  loading.value = true
  try { const res = await getRoles(); tableData.value = res.data } catch {} finally { loading.value = false }
}
function showCreateDialog() {
  isEdit.value = false; editId = null
  form.value = { role_name: '', role_key: '', permissions: [], status: 1, remark: '' }
  dialogVisible.value = true
}
function showEditDialog(row) {
  isEdit.value = true; editId = row.id
  form.value = { role_name: row.role_name, role_key: row.role_key, permissions: [...(row.permissions || [])], status: row.status, remark: row.remark || '' }
  dialogVisible.value = true
}
async function submitForm() {
  if (isEdit.value) {
    await updateRole(editId, { role_name: form.value.role_name, permissions: form.value.permissions, status: form.value.status, remark: form.value.remark })
  } else {
    await createRole(form.value)
  }
  ElMessage.success(isEdit.value ? '修改成功' : '创建成功'); dialogVisible.value = false; fetchData()
}
async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除角色 ${row.role_name}？`, '删除确认', { type: 'warning' })
  await deleteRole(row.id); ElMessage.success('删除成功'); fetchData()
}
onMounted(fetchData)
</script>
