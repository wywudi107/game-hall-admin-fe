<template>
  <div>
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="8" v-for="item in statCards" :key="item.label">
        <el-card shadow="hover" class="stat-card-wrap">
          <div class="stat-card">
            <div class="stat-icon" :style="{ background: item.color }">
              <el-icon :size="24"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">{{ item.label }}</div>
              <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="充值趋势">
          <div ref="rechargeChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="提现趋势">
          <div ref="withdrawChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="新增用户趋势">
          <div ref="userChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="游戏热度 TOP 10">
          <div ref="gameChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getStats, getTrend } from '@/api/dashboard'

const stats = ref({})
const rechargeChartRef = ref()
const withdrawChartRef = ref()
const userChartRef = ref()
const gameChartRef = ref()
let charts = []

const statCards = computed(() => [
  { label: '今日充值', value: `¥${stats.value.today_recharge_amount || 0}`, color: '#409eff', icon: 'Wallet' },
  { label: '今日提现', value: `¥${stats.value.today_withdraw_amount || 0}`, color: '#e6a23c', icon: 'Money' },
  { label: '今日净收入', value: `¥${stats.value.today_net_income || 0}`, color: stats.value.today_net_income >= 0 ? '#67c23a' : '#f56c6c', icon: 'TrendCharts' },
  { label: '在线用户', value: stats.value.online_user_count || 0, color: '#52c41a', icon: 'UserFilled' },
  { label: '今日注册', value: stats.value.today_user_count || 0, color: '#722ed1', icon: 'Plus' },
  { label: '总用户数', value: stats.value.total_user_count || 0, color: '#13c2c2', icon: 'User' },
])

function initLineChart(el, dates, values, color, name) {
  const chart = echarts.init(el)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: [{ name, type: 'line', data: values, smooth: true, itemStyle: { color } }],
  })
  charts.push(chart)
}

function initBarChart(el, names, values) {
  const chart = echarts.init(el)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 80, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: names },
    series: [{ type: 'bar', data: values, itemStyle: { color: '#409eff' } }],
  })
  charts.push(chart)
}

onMounted(async () => {
  try {
    const [statsRes, trendRes] = await Promise.all([getStats(), getTrend({ days: 7 })])
    stats.value = statsRes.data

    const trend = trendRes.data
    initLineChart(rechargeChartRef.value, trend.recharge_trend.map(d => d.date), trend.recharge_trend.map(d => d.amount), '#409eff', '充值金额')
    initLineChart(withdrawChartRef.value, trend.withdraw_trend.map(d => d.date), trend.withdraw_trend.map(d => d.amount), '#e6a23c', '提现金额')
    initLineChart(userChartRef.value, trend.user_trend.map(d => d.date), trend.user_trend.map(d => d.count), '#67c23a', '新增用户')
    initBarChart(gameChartRef.value, trend.hot_games.map(g => g.game_name).reverse(), trend.hot_games.map(g => g.play_count).reverse())
  } catch {}
})

onUnmounted(() => {
  charts.forEach(c => c.dispose())
})
</script>

<style scoped>
.stat-row {
  display: flex;
  flex-wrap: wrap;
  row-gap: 16px;
}
.stat-card-wrap {
  height: 100%;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.stat-info {
  flex: 1;
  min-width: 0;
}
.stat-label {
  font-size: 14px;
  color: #999;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 4px;
}
</style>
