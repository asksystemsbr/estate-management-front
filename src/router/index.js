import { createRouter, createWebHistory } from 'vue-router';
import auth from '@/auth'; // Importe o serviço de autenticação
import LoginForm from '../views/LoginFormView.vue';
import AppMenu from '../views/AppMenuView.vue';
import TipoPagamento from '../views/TipoPagamentoView.vue';
import ContasCategorias from '../views/ContasCategoriasView.vue';
import Funcionario from '../views/FuncionarioView.vue';
import UsuarioToGrupo from '../views/UsuarioToGrupoView.vue';
import Permissao from '../views/PermissaoView.vue';
import Cliente from '../views/ClienteView.vue';
import GrupoUsuario from '../views/GrupoUsuarioView.vue';
import Imovel from '../views/ImovelView.vue';
import Contrato from '../components/Contratos/ContratoEdit.vue';
import Fiador from '../views/FiadorView.vue';
import Locador from '../views/LocadorView.vue';
import Home from '../views/HomeView.vue';
import ContaSubCategoria from '../views/ContaSubCategoriaView.vue';
import ContasPagar from '../views/ContasPagarView.vue';
import ContasReceber from '../views/ContasReceberView.vue';
import ContasList from '../components/Contas/ContasList.vue';
import ChartPayment from '../components/Reports/ChartAccount/ChartPayment.vue';
import ClientReport from '../components/Reports/Client/ClientReport.vue';
import CashFlow from '../components/Reports/CashFlow/CashFlow.vue';
import ChartAccountability from '../components/Reports/Accountability/ChartAccountability.vue';
import ChartDemonstrativoAluguel from '../components/Reports/DemonstrativoAluguel/ChartDemonstrativoAluguel.vue';
import ChartDimob from '../components/Reports/Dimob/ChartDIMOB.vue';
//testes
// import FuncionarioCreate from '../components/Funcionario/FuncionarioCreate.vue';
// import FuncionarioEdit from '../components/Funcionario/FuncionarioEdit.vue';
// import FuncionarioList from '../components/Funcionario/FuncionarioList.vue'; 

 import LaudoPicture from '../components/Laudos/LaudosPictures.vue'; 
 import LaudoEdit from '../components/Laudos/LaudoEdit.vue'; 


const routes = [
  {
    path: '/',
    name: 'Root',
    component: LoginForm    
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm    
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/menu',
    name: 'AppMenu',
    component: AppMenu,
    meta: { requiresAuth: true }
  },
  {
    path: '/tipopagamento',
    name: 'TipoPagamento',
    component: TipoPagamento,
    meta: { requiresAuth: true }
  },
  {
    path: '/funcionario',
    name: 'Funcionario',
    component: Funcionario,
    meta: { requiresAuth: true }
  },
    {
    path: '/usuariotogrupo',
    name: 'UsuarioToGrupo',
    component: UsuarioToGrupo,
    meta: { requiresAuth: true }
  } ,
  {
    path: '/permissao',
    name: 'Permissao',
    component: Permissao,
    meta: { requiresAuth: true }
  },
  {
    path: '/cliente',
    name: 'Cliente',
    component: Cliente,
    meta: { requiresAuth: true }
  },
  {
    path: '/grupousuario',
    name: 'GrupoUsuario',
    component: GrupoUsuario,
    meta: { requiresAuth: true }
  },
  {
    path: '/imovel',
    name: 'Imovel',
    component: Imovel,
    meta: { requiresAuth: true }
  },
  {
    path: '/contrato',
    name: 'Contrato',
    component: Contrato,
    meta: { requiresAuth: true }
  },
  {
    path: '/fiador',
    name: 'Fiador',
    component: Fiador,
    meta: { requiresAuth: true }
  },
  {
    path: '/locador',
    name: 'Locador',
    component: Locador,
    meta: { requiresAuth: true }
  },
  {
    path: '/laudopicture/:id/:start',
    name: 'LaudoPicture',
    component: LaudoPicture,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/laudoedit',
    name: 'LaudoEdit',
    component: LaudoEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/contasCategorias',
    name: 'ContasCategorias',
    component: ContasCategorias,
    meta: { requiresAuth: true }
  },
  {
    path: '/contasSubCategorias',
    name: 'ContaSubCategoria',
    component: ContaSubCategoria,
    meta: { requiresAuth: true }
  },
  {
    path: '/contalist',
    name: 'Contalist',
    component: ContasList,
    meta: { requiresAuth: true }
  },
  {
    path: '/contasPagar',
    name: 'contasPagar',
    component: ContasPagar,
    meta: { requiresAuth: true }
  },
  {
    path: '/contasReceber',
    name: 'contasReceber',
    component: ContasReceber,
    meta: { requiresAuth: true }
  },
  {
    path: '/chartPayment',
    name: 'chartPayment',
    component: ChartPayment,
    meta: { requiresAuth: true }
  },
  {
    path: '/clientReport',
    name: 'clientReport',
    component: ClientReport,
    meta: { requiresAuth: true }
  },
  {
    path: '/cashFlow',
    name: 'cashFlow',
    component: CashFlow,
    meta: { requiresAuth: true }
  },
  {
    path: '/chartAccountability',
    name: 'chartAccountability',
    component: ChartAccountability,
    meta: { requiresAuth: true }
  },
  {
    path: '/chartDemonstrativoAluguel',
    name: 'chartDemonstrativoAluguel',
    component: ChartDemonstrativoAluguel,
    meta: { requiresAuth: true }
  },
  {
    path: '/chartDimob',
    name: 'chartDimob',
    component: ChartDimob,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/funcionariocreate',
  //   name: 'FuncionarioCreate',
  //   component: FuncionarioCreate,
  //   //meta: { requiresAuth: true }
  // }  
  // ,
  // {
  //   path: '/funcionarioedit/:id', // Adiciona parâmetro `id` na URL
  //   name: 'FuncionarioEdit',
  //   component: FuncionarioEdit,
  //   props: true, // Passa `id` como prop para o componente
  //   //meta: { requiresAuth: true }
  // } ,
  // {
  //   path: '/funcionario',
  //   name: 'FuncionarioList',
  //   component: FuncionarioList,
  //   //meta: { requiresAuth: true }
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  console.log('Rota destino:', to);
  console.log('Usuário autenticado?', auth.isAuthenticated());
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    console.log('Usuário não autenticado. Redirecionando para /login.');
    // Redireciona para a página de login se a rota requer autenticação e o usuário não está autenticado
    next('/');
  } else {
    console.log('Usuário autenticado. Permitindo acesso à rota.');
    // Permite o acesso à rota
    next();
  }
});

export default router