import Vue from 'vue'
import VueRouter from 'vue-router'
import Word from '../views/Word.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'word',
        component: Word
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
