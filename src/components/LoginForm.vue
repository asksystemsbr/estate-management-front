<template>
  <v-container class="fill-height" fluid>
    <!-- Se o usuário já estiver autenticado, redirecione para a página inicial -->
    <template v-if="auth.isAuthenticated()">
      <router-link :to="{ name: 'AppMenu' }">Ir para o menu</router-link>
    </template>    
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" outlined>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="credentials.Nome"
                label="Nome"
                prepend-icon="mdi-account"
                required
              ></v-text-field>
              <v-text-field
                v-model="credentials.Senha"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                prepend-icon="mdi-lock"
                @click:append="showPassword = !showPassword"
                required
              ></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit" block>Entrar</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
        <!-- Snackbar for displaying login status -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="snackbar.timeout"
        >
          {{ snackbar.message }}
          <template v-slot:action>
            <v-btn text color="white" @click="snackbar.show = false">
              Fechar
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
//import apiUrl from '@/config'; // Importar o URL base
import { useRouter } from 'vue-router';
import auth from '@/auth'; // Importe o serviço de autenticação

export default {
  setup() {
    const credentials = ref({
      Nome: '',
      Senha: '',
      token: '',
      permissions:null
    });
    const showPassword = ref(false);
    //const apiUrlMontada = `${apiUrl}/api/Usuarios/authenticate`;
    const apiUrlMontada = `/api/Usuarios/authenticate`;
    const router = useRouter(); // Importar o router do Vue Router

    const snackbar = ref({
      show: false,
      message: '',
      color: '',
      timeout: 3000
    });

    // const checkAuthAndRedirect = async () => {
    //   // Verifica se o usuário está autenticado
    //   if (auth.isAuthenticated()) {
    //     // Redireciona para a rota 'AppMenu' se o usuário estiver autenticado
    //     await router.push({ name: 'AppMenu' });
    //   }
    // };
    
    const login = async () => {
      try {
        const response = await axios.post(apiUrlMontada, credentials.value);
        const userData = response.data;
        // Armazenar dados de autenticação no localStorage
        localStorage.setItem('accessToken', userData.token);
        localStorage.setItem('userNome', userData.nome);
        localStorage.setItem('userPermissions', JSON.stringify(userData.permissions)); 


        snackbar.value.message = `Login bem-sucedido! Nome: ${userData.nome}`;
        snackbar.value.color = 'success';
        snackbar.value.show = true;    
        credentials.value.token = userData.token;        
        credentials.value.permissions = userData.permissions;   
        console.log(auth);
        auth.login(credentials.value);
        // Redirecionar usuário ou salvar dados de login conforme necessário
        router.push({ name: 'AppMenu' });
        console.log(auth);
      } catch (error) {
        console.log(error);
        snackbar.value.message = 'Erro no login: ' + (error.response ? error.response.data : 'Erro no servidor ou na conexão');
        snackbar.value.color = 'error';
        snackbar.value.show = true;
      }
    };

        // Chama a função de verificação de autenticação ao criar o componente
       // checkAuthAndRedirect();
    return { credentials, showPassword, login, snackbar,auth  };
  }
};
</script>