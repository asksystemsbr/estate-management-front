// Importações necessárias
import { createApp } from 'vue';
import axios from 'axios';
import router from './router';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import apiUrl from '@/config'; // Importe o URL base da API
import errorHandlingMixin from './utilities/errorHandling';

// Carregar fontes ou outras configurações de plugins
loadFonts();

// Criar a aplicação Vue
const app = createApp(App);

app.mixin(errorHandlingMixin);

// Configuração global do Axios
axios.defaults.baseURL = apiUrl; // Define o URL base da API para todas as requisições

// Interceptor para adicionar o token JWT aos cabeçalhos de autorização
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Recupera o token JWT do armazenamento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token JWT aos cabeçalhos de autorização
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

// Configurar o Vue Router
app.use(router);

app.use(vuetify);

// Montar a aplicação no elemento com o ID 'app'
app.mount('#app');
