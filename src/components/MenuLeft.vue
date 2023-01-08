<template>
  <div class="menu-left">
    <el-menu :default-active="activeIndex" @select="handleSelect">
      <el-menu-item index="1">短链接配置</el-menu-item>
      <el-menu-item index="2">https接口Mock</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeIndex = ref("1");

const handleSelect = (index: string) => {
  activeIndex.value = index;
  const routerMap: Record<string, string> = {
    1: "shortLink",
    2: "apiMock",
  };
  router.push({ name: routerMap[index] || "/" });
};
</script>

<style scoped>
.menu-left {
}
</style>
