<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import MenuLeft from "./components/MenuLeft.vue";
import axios from "@/utils/axios";
import { useGlobalStore } from "@/stores/global";
import { ElMessage } from "element-plus";
import { onBeforeMount } from "vue";

const { accountInfo } = useGlobalStore();
const route = useRoute();

// 获取用户信息
const getUserInfo = async () => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep, test loading
    const res: any = await axios.get("/user/info");
    console.log("获取用户信息", res);
    Object.assign(accountInfo, res.data);
  } catch (e) {
    console.error(e);
    ElMessage.error((e as Error).message);
  }
};

onBeforeMount(() => {
  getUserInfo();
  console.log("xxx");
});
</script>

<template>
  <header class="home-header">
    <h1>zuo-config 配置中心</h1>
    <div>
      {{ accountInfo.name }}
      <a href="https://github.com/zuoxiaobai/zuo-config-fe" target="_blank">
        Github
      </a>
    </div>
  </header>
  <main class="home-main">
    <nav class="home-main-left" v-if="!route.meta.hideLeftMenu">
      <Menu-Left></Menu-Left>
    </nav>
    <section
      class="home-main-right"
      :class="{ 'hide-left-menu': route.meta.hideLeftMenu }"
    >
      <RouterView />
    </section>
  </main>
  <!-- <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink> -->
</template>

<style lang="scss" scoped>
$header-height: 60px;
$left-menu-width: 200px;
.home-header {
  height: $header-height;
  box-shadow: 0 0 8px #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  h1 {
    color: #333;
    font-size: 18px;
  }
}
.home-main {
  display: flex;
  height: calc(100vh - $header-height);
  min-height: 800px;
  .home-main-left {
    flex-basis: $left-menu-width;
    flex-shrink: 0;
    box-shadow: 0 0 5px #eee;
  }
  .home-main-right {
    width: calc(100% - $left-menu-width);
    padding: 20px;
    box-sizing: border-box;
    &.hide-left-menu {
      width: 100%;
    }
  }
}
</style>
