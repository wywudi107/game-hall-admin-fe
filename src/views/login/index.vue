<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2>游戏大厅后台管理系统</h2>
      <el-form :model="form" @keyup.enter="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" prefix-icon="User" placeholder="请输入用户名" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" prefix-icon="Lock" placeholder="请输入密码" type="password" show-password size="large" />
        </el-form-item>
        <el-form-item>
          <div class="captcha-row">
            <img class="captcha-image" :src="captchaImage" @click="loadCaptcha" title="点击刷新" />
            <el-input v-model="form.captcha_answer" placeholder="请输入计算结果" size="large" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" style="width: 100%" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { login, getCaptcha } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const captchaImage = ref('')
const form = ref({ username: '', password: '', captcha_id: '', captcha_answer: '' })

async function loadCaptcha() {
  try {
    const res = await getCaptcha()
    form.value.captcha_id = res.data.captcha_id
    captchaImage.value = res.data.image
    form.value.captcha_answer = ''
  } catch {
    captchaImage.value = ''
  }
}

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  if (!form.value.captcha_answer) {
    ElMessage.warning('请输入验证码')
    return
  }
  loading.value = true
  try {
    const res = await login(form.value)
    userStore.setLoginData(res.data)
    ElMessage.success('登录成功')
    router.push('/')
  } catch {
    loadCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(loadCaptcha)
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 22px;
}
.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
}
.captcha-image {
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.captcha-image:hover {
  opacity: 0.8;
}
</style>
