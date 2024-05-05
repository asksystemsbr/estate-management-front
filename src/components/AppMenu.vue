<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list dense>
        <!-- Início -->
        <v-list-item @click="navigateTo('Home')" link prepend-icon="mdi-home" >Início</v-list-item>


        <v-list-group value="Cadastros">  
          <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-account-circle"
                title="Cadastros"
              ></v-list-item>
          </template>
          <!-- Subitens de Cadastros -->
          <v-list-item v-if="userCan(['Cliente.Read','Cliente.Write'])" @click="navigateTo('Cliente')" link>Cliente</v-list-item>
          <v-list-item v-if="userCan(['Fiador.Read','Fiador.Write'])" @click="navigateTo('Fiador')" link>Fiador</v-list-item>
          <v-list-item v-if="userCan(['Funcionarios.Read','Funcionarios.Write'])" @click="navigateTo('Funcionario')" link>Funcionario</v-list-item>
          <v-list-item v-if="userCan(['Locador.Read','Locador.Write'])" @click="navigateTo('Locador')" link>Locador</v-list-item>
          <v-list-item v-if="userCan(['TipoPagamento.Read','TipoPagamento.Write'])" @click="navigateTo('TipoPagamento')" link>Tipos de Pagamentos</v-list-item>          
          <v-list-item v-if="userCan(['Imovels.Read','Imovels.Write'])" @click="navigateTo('Imovel')" link> Imóveis</v-list-item>  
        </v-list-group>     
        
        <v-list-group value="Ferramentas">  
          <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-account-circle"
                title="Ferramentas"
              ></v-list-item>
          </template>
          <!-- Subitens de Ferramentas -->         
          <v-list-item v-if="userCan(['Document.Read','Document.Write'])" @click="navigateTo('Contrato')" link> Gestão Contratos</v-list-item>  
        </v-list-group>
        
        <v-list-group value="PermissaoUser">  
          <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-account-key"
                title="Permissão Usuários"
              ></v-list-item>
          </template>
          <!-- Subitens -->
          <v-list-item v-if="userCan(['GrupoUsuarios.Read','GrupoUsuarios.Write'])" @click="navigateTo('GrupoUsuario')" link>Grupos de Usuários</v-list-item>
          <v-list-item v-if="userCan(['Usuarios.Read','Usuarios.Write'])" @click="navigateTo('UsuarioToGrupo')" link>+ Usuário no grupo</v-list-item>
          <v-list-item v-if="userCan(['Permissoes.Read','Permissoes.Write'])" @click="navigateTo('Permissao')" link>Setar Permissões</v-list-item>
          
        </v-list-group>  

        <!-- Sair -->
        <v-list-item @click="logout" link prepend-icon="mdi-home" >Sair</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Minha Aplicação</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!-- Renderiza o componente correspondente à rota atual dentro do mdiform -->
      <component :is="currentComponent" v-if="currentComponent" @close="currentComponent = null" />
    </v-main>
  </v-app>
</template>

<script>
//import { ref } from 'vue';
import Home from './Home.vue'; // Importe os componentes correspondentes às rotas
import TipoPagamento from '../views/TipoPagamentoView.vue';
import Funcionario from '../views/FuncionarioView.vue';
import GrupoUsuario from '../views/GrupoUsuarioView.vue';
import UsuarioToGrupo from '../views/UsuarioToGrupoView.vue';
import Permissao from '../views/PermissaoView.vue';
import Cliente from '../views/ClienteView.vue';
import Imovel from '../views/ImovelView.vue';
import Contrato from '../views/ContratoView.vue';
import Fiador from '../views/FiadorView.vue';
import Locador from '../views/LocadorView.vue';
import auth from '@/auth'; // Importe o serviço de autenticação


export default {
  components: {
    Home,
    TipoPagamento,
    Funcionario,
    GrupoUsuario,
    UsuarioToGrupo,
    Permissao,
    Cliente,
    Imovel,
    Contrato,
    Fiador,
    Locador,
  },
  data() {
    return {
      drawer: false,
      cadastrosExpanded: false,
      currentComponent: null, // Estado para controlar o componente dentro do mdiform
    };
  },
  methods: {
    navigateTo(routeName) {
      //this.$router.push({ name: routeName });
      this.drawer= false;
      this.currentComponent = routeName;
    },
    logout() {      
      alert('Saindo da aplicação...');
      // Limpar os dados de autenticação
      auth.logout(); // Exemplo de método para limpar dados de autenticação      
      this.$router.push({ name: 'Login' });
    },
    toggleCadastros() {
      this.cadastrosExpanded = !this.cadastrosExpanded;
    },
    userCan(permissions) {
      
      if (!Array.isArray(permissions)) {
        permissions = [permissions];
      }
      
      //console.log("Objeto Auth: ", auth);
        // Debug: log the permissions being checked
        //console.log("Checking permissions for: ", permissions);

        // Check if the user's permissions array is defined and contains any of the required permissions
        const hasPermission = permissions.some(permission => auth.permissions && auth.permissions.includes(permission));

        // Debug: log result of permission check
        //console.log("User permissions available: ", auth.permissions);
        //console.log("Permission check passed: ", hasPermission);

        return hasPermission;
    },
  },
};
//console.log('Objeto Auth: ', auth);
</script>

<style>
/* Estilos opcionais personalizados */
</style>
