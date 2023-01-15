import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: () => ({ path: "/short-link" }),
    },
    {
      path: "/short-link",
      name: "shortLink",
      component: () => import("@/views/ShortLink.vue"),
    },
    {
      path: "/api-mock",
      name: "apiMock",
      component: () => import("@/views/ApiMock.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login.vue"),
      meta: { requiresAuth: false, hideLeftMenu: true },
    },
  ],
});

export default router;
