import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { vMaska } from "maska"
import axios from './axios'

Vue.config.productionTip = false
Vue.prototype.$axios = axios; 

// Регистрация директивы маски
Vue.directive("maska", vMaska)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')

