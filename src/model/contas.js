import { ref } from 'vue';

const contas = ref({
  id: 0,
  contaNome: '',
  valor: 0.0,
  tipo: '',
  dtVencimento: null,
  dtPgto: null,
  clienteId: null,
  valorPagoRecebido: 0.0,
  fornecedorId: null,
  categoriaId: 0,
  subCategoriaId: 0,
  formaPagamentoId: 0,
  numCheque: '',
  transferencia: 0,
});

function clearContas() {
  contas.value = {
    id: 0,
    contaNome: '',
    valor: 0.0,
    tipo: '',
    dtVencimento: null,
    dtPgto: null,
    clienteId: null,
    valorPagoRecebido: 0.0,
    fornecedorId: null,
    categoriaId: 0,
    subCategoriaId: 0,
    formaPagamentoId: 0,
    numCheque: '',
    transferencia: 0,
  };
}

export { contas, clearContas };