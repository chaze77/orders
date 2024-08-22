import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/pages/Login.vue';
import Appeals from '@/pages/Appeals.vue'; 


Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Appeals',
    component: Appeals,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('authToken'); 
  if (to.matched.some(record => record.meta.requiresAuth)) {
  
    if (!authToken) {
      next({ name: 'Login' });
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});




export default router;

