<template>
  <v-container>
    <p>Список заявок</p>
    <v-card>
      <!-- Секция с кнопками -->
      <v-card-title class="d-flex justify-space-between">
        <v-btn
          color="secondary"
          @click="resetFilters"
          class="text-none"
        >
          Сбросить фильтры
        </v-btn>
        <v-btn
          color="#44A248"
          class="white--text text-none btn"
          @click="openDialog"
        >
          Создать
        </v-btn>
      </v-card-title>

      <!-- Секция с фильтрами -->
      <v-card-title>
        <v-text-field
          v-model="lockalSearch"
          append-icon="mdi-magnify"
          label="Поиск заявки"
          single-line
          color="#44A248"
          hide-details
          @change="onSearchChange"
          style="margin-bottom: 21px; margin-right: 15px"
        ></v-text-field>

        <v-select
          :value="selectedPremise"
          :items="premises"
          item-text="full_address"
          item-value="id"
          label="Выберите дом"
          color="#44A248"
          @change="onPremiseChange"
        ></v-select>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredAppeals"
        :items-per-page="pageSize"
        :page.sync="page"
        :server-items-length="totalItems"
        class="elevation-1"
        @update:page="updatePage"
        @click:row="openEditModal"
      >
        <template v-slot:item.number="{ item }">
          <v-chip
            color="#44A248"
            class="white--text ma-2"
            label
          >
            {{ item.number }}
          </v-chip>
        </template>
        <template v-slot:item.applicant="{ item }">
          <span
            >{{ item.applicant.last_name }}
            {{ item.applicant.first_name }}</span
          >
        </template>
        <template v-slot:item.status="{ item }">
          <span>{{ item.status.name }} </span>
        </template>
        <template v-slot:item.due_date="{ item }">
          <span>{{ formatDate(item.due_date) }}</span>
        </template>
        <template v-slot:item.created_at="{ item }">
          <span>{{ formatDate(item.created_at) }}</span>
        </template>
        <template v-slot:item.address="{ item }">
          <span>{{
            item.premise ? item.premise.address : 'Адрес не указан'
          }}</span>
        </template>
      </v-data-table>
    </v-card>
    <ModalAction
      :modalKey="modalKey"
      :dialog.sync="dialog"
      :appealId="selectedAppealId"
      :isEditMode="editMode"
      @close="onDialogClose"
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import ModalAction from '@/components/ModalAction.vue';

export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      lockalSearch: '',
      dialog: false,
      editMode: false,
      selectedAppealId: null,
      modalKey: 0,
    };
  },
  components: {
    ModalAction,
  },
  computed: {
    ...mapGetters('appeals', ['appeals', 'totalItems', 'selectedPremise']),
    headers() {
      return [
        { text: '№', value: 'number', sortable: true },
        { text: 'Создана', value: 'created_at', sortable: true },
        { text: 'Адрес', value: 'address', sortable: false },
        { text: 'Заявитель', value: 'applicant', sortable: false },
        { text: 'Описание', value: 'description', sortable: false },
        { text: 'Срок', value: 'due_date', sortable: false },
        { text: 'Статус', value: 'status', sortable: true },
      ];
    },
    premises() {
      if (!this.appeals || !this.appeals.results) {
        return [];
      }

      const uniquePremises = {};
      this.appeals.results.forEach((appeal) => {
        if (appeal.premise && !uniquePremises[appeal.premise.id]) {
          uniquePremises[appeal.premise.id] = appeal.premise;
        }
      });

      return Object.values(uniquePremises);
    },
    filteredAppeals() {
      if (this.selectedPremise) {
        return this.appeals.results.filter(
          (appeal) =>
            appeal.premise && appeal.premise.id === this.selectedPremise
        );
      }
      return this.appeals.results || [];
    },
  },
  methods: {
    ...mapActions('appeals', [
      'fetchAppeals',
      'updateSearch',
      'updatePremise',
      'updatePage',
    ]),
    formatDate(dateString) {
      return moment(dateString).format('DD.MM.YYYY HH:mm');
    },
    onPremiseChange(newPremiseId) {
      this.updatePremise(newPremiseId);
    },
    onSearchChange(newSearch) {
      this.updateSearch(newSearch);
    },
    openEditModal(item) {
      this.selectedAppealId = item.id;
      this.modalKey++;

      this.dialog = true;
      this.editMode = true;
    },
    openDialog() {
      this.dialog = true;
      this.editMode = false;
      this.selectedAppealId = null;
    },
    async resetFilters() {
      this.lockalSearch = '';
      this.updateSearch('');
      this.updatePremise(null);
      await this.fetchAppeals();
    },
    onDialogClose() {
      this.dialog = false;
      this.selectedAppealId = null;
      this.editMode = false;
    },
  },

  created() {
    this.fetchAppeals();
  },
};
</script>

<style scoped>
.v-data-table >>> .v-data-table-header th {
  color: #44a248 !important;
}
</style>
