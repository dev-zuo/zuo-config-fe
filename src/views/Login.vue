<template>
  <div class="tips">游客体验账号: 用户名 admin, 密码 admin</div>
  <div class="login-view">
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="用户名" placeholder="请输入用户名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="密码" placeholder="请输入密码">
        <el-input v-model="form.password" type="password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/global";

const { accountInfo } = useGlobalStore();

const router = useRouter();
const form = reactive({
  name: "admin",
  password: "admin",
});

const formRef = ref();
const loading = ref(false);
const onSubmit = async () => {
  try {
    loading.value = true;
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep, test loading
    const res: any = await axios.post("/user/login", {
      name: form.name,
      password: form.password,
    });
    console.log(res);
    if (res.code === 0) {
      ElMessage.success("登录成功");
      Object.assign(accountInfo, res.data); // 将用户信息/token 写入 pinia 状态管理
      localStorage.setItem("config-fe-token", res?.data?.token); // 防止刷新页面后 token 丢失
      router.push({ name: "home" });
    }
  } catch (e) {
    console.error(e);
    ElMessage.error((e as Error).message);
  } finally {
    loading.value = false;
  }
};
</script>

<script lang="ts">
export default {
  name: "LoginVue",
};
</script>

<style lang="scss" scoped>
.login-view {
  display: flex;
  justify-content: center;
  .el-form {
    margin-top: 80px;
    max-width: 500px;
  }
}
.tips {
  width: 100%;
  text-align: center;
}
</style>
