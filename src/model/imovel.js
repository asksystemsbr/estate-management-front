import { ref } from 'vue';

const imovel = ref({
  id: 0,
  clienteId: 0,
  locadorId: 0,
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
  obs: '',
  DataEntrada: null,
  SeguroFianca: null,
  ModalidadeSeguro: null,
  NumeroApolice: null,
  DataInicioSeguro: null,
  HoraInicioSeguro: null,
  DataFimSeguro: null,
  CodigoImovel: null,
  isFiador: false,
  diaVencimento: null,
  finalidade: '',
  ramoSeguro: '',
  valor_caucao: 0,
  semSeguro:'0'
  //fiadores: []
});

function clearImovel() {
  imovel.value = {
    id: 0,
    clienteId: 0,
    locadorId: 0,
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
    obs: '',
    dataEntrada: null,
    seguroFianca: null,
    modalidadeSeguro: null,
    numeroApolice: null,
    dataInicioSeguro: null,
    horaInicioSeguro: null,
    dataFimSeguro: null,
    codigoImovel: null,
    isFiador: false,
    diaVencimento: null,
    finalidade: '',
    ramoSeguro: '',
    valor_caucao: 0,
    semSeguro:'0'
    //fiadores: []
  };
}

export { imovel, clearImovel };
