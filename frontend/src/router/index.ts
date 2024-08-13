import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import POIsView from '@/views/POIsView.vue';
import POIDetailView from '@/views/POIDetailView.vue';
import RoutesView from '@/views/RoutesView.vue';
import ChangesView from '@/views/ChangesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/routes',
      name: 'routes',
      component: RoutesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/routes/:routeId/pois',
      name: 'pois',
      component: POIsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/routes/:routeId/pois/:poiId',
      name: 'poi-detail',
      component: POIDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: '/changes',
      name: 'changes',
      component: ChangesView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some((record) => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
