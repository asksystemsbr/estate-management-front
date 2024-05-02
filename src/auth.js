// auth.js

import { reactive, readonly } from 'vue';

const auth = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  permissions: JSON.parse(localStorage.getItem('permissions')) || null,
  isAuthenticated() {    
    return !!auth.user && !!auth.token;
  },
  login(userData) {
    localStorage.setItem('user', JSON.stringify({ nome: userData.Nome }));
    localStorage.setItem('token', userData.token);
    localStorage.setItem('permissions', JSON.stringify(userData.permissions));

    // Simule uma chamada de API para autenticação bem-sucedida
    auth.user = { nome: userData.Nome };
    auth.token = userData.token;
    auth.permissions = userData.permissions;
  },
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');

    auth.user = null;
    auth.token = null;
    auth.permissions = null;
  },
});

//console.log("Auth module loaded", auth);
export default readonly(auth);