<template>
  <div class="wrapper">
    <v-container class="auth-container">
      <div class="card-title">Авторизация</div>
      <div class="input-container">
        <v-text-field
          v-model="username"
          label="Логин и телефон"
          prepend-inner-icon="mdi-phone"
          class="custom-text-field"
          color="#44A248"
          :rules="nameRules"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Пароль"
          prepend-inner-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          color="#44A248"
          :rules="passwordRules"
        ></v-text-field>
      </div>

      <div class="button-container">
        <v-btn
          color="#44A248"
          elevation="2"
          large
          class="white--text text-none btn"
          @click="handleLogin"
          >Войти</v-btn
        >
      </div>
      <v-snackbar
        :value="snackbar.show"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        top
        right
      >
        {{ snackbar.message }}
        <v-btn
          color="white"
          text
          @click="snackbar.show = false"
          >Закрыть</v-btn
        >
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      nameRules: [(v) => !!v || 'Логин или телефон обязателен'],
      passwordRules: [(v) => !!v || 'Пароль обязателен'],
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 5000,
      },
    };
  },
  methods: {
    ...mapActions('auth', ['login']),

    async handleLogin() {
      const credentials = {
        username: this.username,
        password: this.password,
      };

      try {
        const response = await this.login(credentials);
        console.log('response.data.key', response);

        if (response && response.statusText === 'OK') {
          this.showSnackbar('Успешная авторизация!', 'success');

          // Задержка перед переходом на главную страницу
          setTimeout(() => {
            this.$router.push('/');
          }, 1500); // Задержка в 1,5 секунды
        } else {
          this.showSnackbar(
            'Ошибка авторизации. Проверьте ваши данные.',
            'error'
          );
        }
      } catch (error) {
        this.showSnackbar(
          'Ошибка авторизации. Проверьте ваши данные.',
          'error'
        );
        console.error('Ошибка авторизации', error);
      }
    },

    showSnackbar(message, type) {
      this.snackbar.message = message;
      this.snackbar.color = type === 'success' ? 'green' : 'red';
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped lang="scss">
/* Ваши стили */
</style>

<style scoped lang="scss">
.wrapper {
  background-image: url('../assets/images/banner.jpg');
  background-position: center;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  width: 340px;
  background-color: white;
  padding: 60px 20px 20px 20px; /* Добавляем padding сверху для размещения заголовка */
  border-radius: 5px;
  position: relative;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.card-title {
  background-color: #44a248;
  width: 308px;
  height: 56px;
  border-radius: 5px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0; /* Закрепляем плашку в верхней части контейнера */
  left: 2;
  transform: translateY(-50%);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.input-container {
  margin-top: 28px; /* Добавляем отступ сверху, чтобы заголовок не перекрывал поля */
  margin-bottom: 28px;
}

.button-container {
  display: flex;
  justify-content: center;
}

.btn {
  width: 110px;
}
</style>
