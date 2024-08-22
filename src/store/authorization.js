import axios from '@/axios'; 

export default {
  namespaced: true,
  state: {
    user: null,
    token: null, 
    error: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('authToken', token); 
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('auth/login/', credentials);
        console.log('res', response.data);
   
        const token = response.data.key;
        if (token) {
          commit('SET_USER', response.data.employee_id);
          commit('SET_TOKEN', token);
          axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        } else {
          throw new Error('Не удалось получить токен авторизации');
        }
   
        return response; 
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка авторизации');
        throw error; 
      }
    },
   
    logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      localStorage.removeItem('authToken'); 
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    user(state) {
      return state.user;
    },
    authError(state) {
      return state.error;
    },
  },
};
