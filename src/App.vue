<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import MenuLeft from "./components/MenuLeft.vue";
</script>

<template>
  <header class="home-header">
    <h1>zuo-config 配置中心</h1>
  </header>
  <main class="home-main">
    <nav class="home-main-left">
      <Menu-Left></Menu-Left>
    </nav>
    <section class="home-main-right">
      <RouterView />
    </section>
  </main>
  <!-- <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink> -->
</template>

<style lang="scss" scoped>
$header-height: 60px;
.home-header {
  height: $header-height;
  box-shadow: 0 0 8px #ddd;
  display: flex;
  align-items: center;
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
    flex-basis: 240px;
    flex-shrink: 0;
    box-shadow: 0 0 5px #eee;
  }
  .home-main-right {
    flex-grow: 1;
    padding: 20px;
  }
}
</style>
