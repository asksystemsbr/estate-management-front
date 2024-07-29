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
                prepend-icon="mdi-tools"
                title="Ferramentas"
              ></v-list-item>
          </template>
          <!-- Subitens de Ferramentas -->         
          <v-list-item v-if="userCan(['Document.Read','Document.Write'])" @click="navigateTo('Contrato')" link>Gestão Contratos</v-list-item>  
          <v-list-item v-if="userCan(['Document.Read','Document.Write'])" @click="navigateTo('Laudos')" link>Vistoria</v-list-item>  
        </v-list-group>
        
        <v-list-group value="Plano_de_Contas">  
          <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-currency-usd"
                title="Plano/Contas"
              ></v-list-item>
          </template>
          <!-- Subitens de Plano_de_Contas -->         
          <v-list-item v-if="userCan(['ContaCategoria.Read','ContaCategoria.Write'])" @click="navigateTo('ContaCategoria')" link>Categorias</v-list-item>  
          <v-list-item v-if="userCan(['ContaSubCategoria.Read','ContaSubCategoria.Write'])" @click="navigateTo('ContaSubCategoria')" link>Sub Categorias</v-list-item>  
          <v-list-item v-if="userCan(['Conta.Read','Conta.Write'])" @click="navigateTo('ContasPagar')" link>Contas Pagar</v-list-item>  
          <v-list-item v-if="userCan(['Conta.Read','Conta.Write'])" @click="navigateTo('ContasReceber')" link>Contas Receber</v-list-item>  
        </v-list-group>

        <v-list-group value="PermissaoUser">  
          <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-account-key"
                title="Permissões"
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
      <v-container v-if="!currentComponent">
        <v-row>
          <!-- <v-col cols="12" sm="6">
            <h2>Contratos (15 dias)</h2>
            <v-btn color="blue" @click="navigateTo('Contrato/15')">Ver 15
            </v-btn>
            <contrato-list :days="15" />
          </v-col> -->
          <v-col cols="12" sm="12">
            <h2>Contratos (30 dias)</h2>
            <v-btn color="blue" @click="navigateTo('Contrato/30')">Ver 30
            </v-btn>
            <contrato-list :days="30" />
          </v-col>
        </v-row>
      </v-container>
      <!-- Renderiza o componente correspondente à rota atual dentro do mdiform -->
      <component :is="currentComponent" v-bind="currentParams" v-if="currentComponent" @close="currentComponent = null" />
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
import ContratoList from './Contratos/ContratoList.vue';
import Laudos from './Laudos/LaudoEdit.vue';
import ContaCategoria from '../views/ContasCategoriasView.vue';
import ContaSubCategoria from '../views/ContaSubCategoriaView.vue';
import ContasPagar from '../views/ContasPagarView.vue';
import ContasReceber from '../views/ContasReceberView.vue';
import ContaList from '../components/Contas/ContasList.vue';
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
    ContratoList,
    Laudos,
    ContaCategoria,
    ContaSubCategoria,
    ContasReceber,
    ContasPagar,
    ContaList,
  },
  data() {
    return {
      drawer: false,
      cadastrosExpanded: false,
      currentComponent: null, // Estado para controlar o componente dentro do mdiform
      currentParams: {},
      currentComponentKey: 0, // Key para forçar a atualização do componente
    };
  },
  methods: {
    navigateTo(routeName) {
      //this.$router.push({ name: routeName });
      //this.$router.push({ name: routeName.toLowerCase() });
      //this.currentComponent = routeName;
      this.drawer= false;    
      const [name, param] = routeName.split('/');
      this.currentComponent = name;
      if(name === 'Contrato')
      {
        this.currentParams = param ? { days: param } : {};
      }
      this.currentComponentKey++; // Incrementa para forçar a atualização do componente
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
