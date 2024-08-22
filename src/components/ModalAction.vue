<template>
  <v-dialog
    v-model="internalDialog"
    max-width="600px"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>{{
          isEditMode
            ? `Заявка № ${form.number} (от  ${form.created_at})`
            : 'Создание заявки'
        }}</span>
        <span>{{ status }}</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-select
              v-model="form.premise_id"
              :items="premises"
              item-text="address"
              item-value="id"
              label="Дом"
              @change="loadApartments"
            />
          </v-col>
          <v-col>
            <v-select
              v-model="form.apartment_id"
              :items="apartments"
              item-text="number"
              item-value="id"
              label="Квартира"
              :disabled="!form.premise_id"
            />
          </v-col>
          <v-col>
            <v-menu
              ref="dueDateMenu"
              v-model="dueDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formattedDueDate"
                  label="Срок"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="form.due_date"
                @input="closeDueDateMenu"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="form.applicant.last_name"
              label="Фамилия"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.applicant.first_name"
              label="Имя"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.applicant.patronymic_name"
              label="Отчество"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.applicant.username"
              label="Телефон"
            />
          </v-col>
        </v-row>

        <v-textarea
          v-model="form.description"
          label="Описание"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="#44A248"
          class="white--text text-none btn"
          @click.stop="isEditMode ? updateAppeal() : createAppeal()"
        >
          {{ isEditMode ? 'Сохранить' : 'Создать' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'ModalAction',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    appealId: {
      type: String,
      default: null, // Используется только в режиме редактирования
    },
    modalKey: {
      type: Number,
    },
  },

  data() {
    return {
      form: {
        premise_id: '',
        apartment_id: '',
        applicant: {
          last_name: '',
          first_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        due_date: '',
        status_id: 1,
        number: null,
        created_at: '',
      },
      status: 'Новая',
      dueDateMenu: false,
    };
  },
  computed: {
    ...mapGetters('appeals', ['appeals', 'apartments']),
    internalDialog: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit('update:dialog', value); // Обновляет состояние в родительском компоненте
      },
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
    formattedDueDate() {
      return this.form.due_date
        ? moment(this.form.due_date).format('DD.MM.YYYY HH:mm')
        : '';
    },
  },
  watch: {
    // Отслеживаем изменение appealId и загружаем детали заявки
    appealId(newVal) {
      if (newVal) {
        this.loadAppealDetails();
      }
    },
    modalKey() {
      this.loadAppealDetails(); // Загружаем данные при изменении ключа
    },

    // Отслеживаем закрытие диалога и сбрасываем форму
    internalDialog(newValue) {
      if (!newValue) {
        this.resetForm();
      }
    },
    'form.premise_id': function (newVal) {
      if (newVal) {
        this.loadApartments(); // Вызываем функцию загрузки квартир
      }
    },
    'form.due_date': function (newVal) {
      this.formattedDueDate; // Это вызовет вычисляемое свойство
    },

    // Отслеживаем изменение apartment_id в форме и логируем его значение
    'form.apartment_id': function (newVal) {
      console.log('Новое значение apartment_id:', newVal);
    },
  },
  methods: {
    ...mapActions('appeals', [
      'createAppeal',
      'fetchApartments',
      'updateAppeal',
      'fetchAppealDetails',
    ]),

    closeDialog() {
      this.internalDialog = false;
    },
    closeDueDateMenu() {
      this.dueDateMenu = false;
    },
    async loadApartments() {
      if (this.form.premise_id) {
        await this.fetchApartments({ premise_id: this.form.premise_id });
      }
    },
    loadAppealDetails() {
      console.log('this.isEditMode', this.isEditMode);

      if (this.appealId) {
        const appeal = this.appeals.results.find(
          (item) => item.id === this.appealId
        );
        if (appeal) {
          this.form = {
            premise_id: appeal.premise.id,
            apartment_id: appeal.apartment.id,
            applicant: {
              last_name: appeal.applicant.last_name,
              first_name: appeal.applicant.first_name,
              patronymic_name: appeal.applicant.patronymic_name,
              username: appeal.applicant.username,
            },
            description: appeal.description,
            due_date: appeal.due_date,
            created_at: moment(appeal.created_at).format('DD.MM.YYYY'),
            status_id: appeal.status_id,
            number: appeal.number,
          };
          this.status = appeal.status.name;
        } else {
          console.error('Заявка не найдена');
        }
      }
    },
    async createAppeal() {
      try {
        const formattedDueDate = moment(this.form.due_date).format(
          'YYYY-MM-DDTHH:mm:ssZ'
        );
        const formData = { ...this.form, due_date: formattedDueDate };
        await this.$store.dispatch('appeals/createAppeal', formData);
        await this.$store.dispatch('appeals/fetchAppeals');
        this.closeDialog();
      } catch (error) {
        console.error('Ошибка при создании заявки:', error);
      }
    },
    async updateAppeal() {
      try {
        const formattedDueDate = moment(this.form.due_date).format(
          'YYYY-MM-DDTHH:mm:ssZ'
        );
        const formData = { ...this.form, due_date: formattedDueDate };
        await this.$store.dispatch('appeals/updateAppeal', {
          appealId: this.appealId,
          formData,
        });
        await this.$store.dispatch('appeals/fetchAppeals');
        this.closeDialog();
      } catch (error) {
        console.error('Ошибка при обновлении заявки:', error);
      }
    },
    resetForm() {
      this.form = {
        premise_id: '',
        apartment_id: '',
        applicant: {
          last_name: '',
          first_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        due_date: '',
        status_id: 1,
      };
      this.status = 'Новая';
    },
  },
};
</script>
