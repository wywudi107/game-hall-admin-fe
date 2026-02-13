<template>
  <el-card>
    <el-form :inline="true" :model="query" class="search-form">
      <el-form-item label="游戏名称">
        <el-input v-model="query.game_name" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable style="width: 100px">
          <el-option label="上线" :value="1" />
          <el-option label="下线" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="游戏ID" width="150" />
      <el-table-column prop="game_name" label="游戏名称" width="150" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '上线' : '下线' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="70" />
      <el-table-column prop="orientation" label="方向" width="70">
        <template #default="{ row }">{{ row.orientation === 0 ? '横屏' : '竖屏' }}</template>
      </el-table-column>
      <el-table-column prop="play_count" label="进入次数" width="90" />
      <el-table-column prop="hot_game" label="热门" width="70">
        <template #default="{ row }">
          <el-tag v-if="row.hot_game === 1" type="danger" size="small">热门</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" v-permission="'game:edit'" @click="showEditDialog(row)">编辑</el-button>
          <el-button link :type="row.status === 1 ? 'danger' : 'success'" size="small" v-permission="'game:toggle_status'" @click="handleToggle(row)">
            {{ row.status === 1 ? '下线' : '上线' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="query.page" v-model:page-size="query.page_size" :total="total"
      :page-sizes="[20, 50, 100]" layout="total, sizes, prev, pager, next" style="margin-top: 16px" @change="fetchData" />
  </el-card>

  <el-dialog v-model="editVisible" title="编辑游戏" width="450px">
    <el-form :model="editForm" label-width="80px">
      <el-form-item label="游戏名称">
        <el-input v-model="editForm.game_name" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="editForm.sort_order" :min="0" />
      </el-form-item>
      <el-form-item label="方向">
        <el-radio-group v-model="editForm.orientation">
          <el-radio :value="0">横屏</el-radio>
          <el-radio :value="1">竖屏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="热门">
        <el-switch v-model="editForm.hot_game" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGames, updateGame, toggleGameStatus } from '@/api/game'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const query = ref({ page: 1, page_size: 20, game_name: '', status: null })
const editVisible = ref(false)
const editForm = ref({ id: '', game_name: '', sort_order: 0, orientation: 0, hot_game: 0 })

async function fetchData() {
  loading.value = true
  try {
    const params = {}
    Object.entries(query.value).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v })
    const res = await getGames(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {} finally { loading.value = false }
}

function showEditDialog(row) {
  editForm.value = { id: row.id, game_name: row.game_name, sort_order: row.sort_order, orientation: row.orientation, hot_game: row.hot_game }
  editVisible.value = true
}

async function submitEdit() {
  const { id, ...data } = editForm.value
  await updateGame(id, data)
  ElMessage.success('修改成功'); editVisible.value = false; fetchData()
}

async function handleToggle(row) {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '上线' : '下线'
  await ElMessageBox.confirm(`确定${action}游戏 ${row.game_name}？`, '提示', { type: 'warning' })
  await toggleGameStatus(row.id, { status: newStatus })
  ElMessage.success(`${action}成功`); fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.search-form { margin-bottom: 16px; }
</style>
