import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import POIDetailView from '@/views/POIDetailView.vue';
import RoutesView from '@/views/RoutesView.vue';
import ChangesView from '@/views/ChangesView.vue';
import RouteDetailView from '@/views/RouteDetailView.vue';
import ARPreviewView from '@/views/ARPreviewView.vue';

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
      path: '/routes/:routeId/',
      name: 'route-detail',
      component: RouteDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: '/routes/:routeId/pois',
      name: 'route-pois',
      redirect(to) {
        return { name: 'route-detail', params: { routeId: to.params.routeId } };
      },
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
    {
      path: '/ar-preview/:routeId/:poiId',
      name: 'ar-preview',
      component: ARPreviewView,
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
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
