import { createRouter, createWebHistory } from 'vue-router';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import UserLogin from './components/UserLogin.vue';
import UserSignup from './components/UserSignup.vue';
import Chat from './components/ChatMessages.vue';

const routes = [
  { path: '/login', component: UserLogin },
  { path: '/signup', component: UserSignup },
  { path: '/chat', name: 'Chat', component: Chat, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Route guard to check authentication status
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next('/login'); // Redirect to login if not authenticated
    } else {
      next(); // Proceed to the route
    }
  });
});

export default router;
