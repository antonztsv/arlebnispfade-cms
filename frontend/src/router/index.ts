import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import POIsView from '@/views/POIsView.vue';
import POIDetail from '@/components/POIDetail.vue';

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
      path: '/routes/:routeId/pois',
      name: 'pois',
      component: POIsView,
      meta: { requiresAuth: true },
      children: [
        {
          path: ':poiId',
          name: 'poi-detail',
          component: POIDetail,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/',
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
