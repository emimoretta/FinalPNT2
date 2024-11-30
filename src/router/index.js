import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import DashBoard from "../pages/DashBoard.vue";

import { validateSession } from "@/services/api";

const routes = [
  { path: "/", component: HomePage },
  {
    path: "/dashboard",
    component: DashBoard,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !validateSession()) {
    alert("Por favor, inicia sesión para acceder.");
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;
