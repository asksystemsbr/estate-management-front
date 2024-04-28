import { ref } from 'vue';

// Define the funcionario object
const funcionario = ref({
  id: 0,
  nome: '',
  telefone: '',
  celular: '',
  email: '',
  comissaoVista: null,
  comissaoPrazo: null,
  comissao: null,
  tipoComissao: '',
  ativo: '1',
  funcaoId: null,
  codBio: null,
  usuarioId: 0
});

function clearFuncionario() {
    // Redefine todas as propriedades do objeto funcionario para seus valores iniciais
    funcionario.value.id = 0;
    funcionario.value.nome = '';
    funcionario.value.telefone = '';
    funcionario.value.celular = '';
    funcionario.value.email = '';
    funcionario.value.comissaoVista = null;
    funcionario.value.comissaoPrazo = null;
    funcionario.value.comissao = null;
    funcionario.value.tipoComissao = '';
    funcionario.value.ativo = '1';
    funcionario.value.funcaoId = null;
    funcionario.value.codBio = null;
    funcionario.value.usuarioId = 0;
  }
// Export the funcionario object
export { funcionario,clearFuncionario};
