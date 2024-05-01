import { ref } from 'vue';

const imovel = ref({
  id: 0,
  clienteId: 0,
  dataVencimento: null,
  valor: 0.00,
  reajuste: null,
  logradouro: '',
  numero: '',
  complemento: '',
  cep: '',
  bairro: '',
  cidade: '',
  uf: '',
  situacaoId: 0,
  obs: ''
});

function clearImovel() {
  imovel.value = {
    id: 0,
    clienteId: 0,
    dataVencimento: null,
    valor: 0.00,
    reajuste: null,
    logradouro: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    situacaoId: 0,
    obs: ''
  };
}

export { imovel, clearImovel };
