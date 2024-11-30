import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import DashBoard from "../pages/DashBoard.vue";

import { validateSession } from "@/services/api";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresGuest: true }, // Solo accesible para usuarios no logueados
  },
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
  if (to.meta.requiresGuest && validateSession()) {
    next('/dashboard');
  }
  // Redirigir a la página de login si intenta acceder a rutas protegidas y no está autenticado
  else if (to.meta.requiresAuth && !validateSession()) {
    next('/');
  } else {
    next(); // Continuar con la navegación
  }
});

export default router;
