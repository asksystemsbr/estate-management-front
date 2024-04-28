// auth.js

import { reactive, readonly } from 'vue';

const auth = reactive({
  user: null,
  token: null,
  permissions: null,
  isAuthenticated() {
    return !!auth.user && !!auth.token;
  },
  login(userData) {
    // Simule uma chamada de API para autenticação bem-sucedida
    auth.user = { nome: userData.Nome };
    auth.token = userData.token;
    auth.permissions = userData.permissions;
  },
  logout() {
    auth.user = null;
    auth.token = null;
    auth.permissions = null;
  },
});

export default readonly(auth);