import Vue from 'vue';
import Vuex from 'vuex';
import auth from './authorization'; 
import appeals from './appeals';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth, 
    appeals
  },
});
