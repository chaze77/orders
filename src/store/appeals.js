import axios from '@/axios'; 

export default {
  namespaced: true,
  state: {
    appeals: [],
    error: null,
    search: '', 
    selectedPremise: null, 
    page: 1, 
    pageSize: 10,
    totalItems: 0,
    premises: [], 
    apartments: [], 
  },
  mutations: {
    SET_APPEALS(state, appeals) {
      state.appeals = appeals;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SEARCH(state, search) {
      state.search = search;
    },
    SET_SELECTED_PREMISE(state, premise) {
      state.selectedPremise = premise;
    },
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_PAGE_SIZE(state, pageSize) {
      state.pageSize = pageSize;
    },
    SET_TOTAL_ITEMS(state, totalItems) {
      state.totalItems = totalItems;
    },
    SET_PREMISES(state, premises) {
      state.premises = premises;
    },
    SET_APARTMENTS(state, apartments) {
      state.apartments = apartments;
    },
  },
  actions: {
    async fetchAppeals({ commit, state }) {
      try {
        const params = {
          search: state.search || undefined,
          premise_id: state.selectedPremise || undefined,
          page_size: state.pageSize,
          page: state.page,
        };

        const response = await axios.get('appeals/v1.0/appeals/', { params });

        if (response && response.data) {
          commit('SET_APPEALS', response.data);
          commit('SET_TOTAL_ITEMS', response.data.count || 0);
        } else {
          throw new Error('Не удалось получить данные от сервера');
        }
      } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения заявок');
      }
    },
    async createAppeal({ commit }, formData) {
      try {
        const response = await axios.post('appeals/v1.0/appeals/', formData);
       
       
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка создания заявки');
        throw error;  
      }
    },
    async updateAppeal({ commit }, { appealId, formData }) {
        try {
          const response = await axios.patch(`appeals/v1.0/appeals/${appealId}/`, formData);
        
        
        } catch (error) {
          commit('SET_ERROR', error.response?.data?.message || 'Ошибка обновления заявки');
          throw error; 
        }
      },

    async fetchApartments({ commit }, { premise_id }) {
      try {
        const response = await axios.get(`geo/v1.0/apartments/?premise_id=${premise_id}&search=`);
        commit('SET_APARTMENTS', response.data.results);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения данных квартир');
      }
    },
    updateSearch({ commit, dispatch }, search) {
      commit('SET_SEARCH', search);
      dispatch('fetchAppeals');
    },
    updatePremise({ commit, dispatch }, premise) {
      commit('SET_SELECTED_PREMISE', premise);
      dispatch('fetchAppeals');
    },
    updatePage({ commit, dispatch }, page) {
      commit('SET_PAGE', page);
      dispatch('fetchAppeals');
    },
    updatePageSize({ commit, dispatch }, pageSize) {
      commit('SET_PAGE_SIZE', pageSize);
      dispatch('fetchAppeals');
    },
  },
  getters: {
    appeals(state) {
      return state.appeals;
    },
    appealsError(state) {
      return state.error;
    },
    search(state) {
      return state.search;
    },
    selectedPremise(state) {
      return state.selectedPremise;
    },
    page(state) {
      return state.page;
    },
    pageSize(state) {
      return state.pageSize;
    },
    totalItems(state) {
      return state.totalItems;
    },
    apartments(state) {
      return state.apartments;
    },
  },
};


