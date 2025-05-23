import { ref } from 'vue';

const fiador = ref({
  id: 0,
  id_situacao_cliente: null,
  nome: '',
  fantasia: '',
  email: '',
  cpf_cnpj: '',
  rg: '',
  orgao_rg: '',
  inscricao_estadual: '',
  inscricao_municipal: '',
  tipo_pessoa: '',
  data_cadastro: null,
  sexo: '',
  logradouro: '',
  numero: '',
  complemento: '',
  cep: '',
  bairro: '',
  cidade: '',
  uf: '',
  fone1: '',
  celular: '',
  contato: '',
  valor_fixo: 0.0,
  forma_pgto: '',
  dias_pgto: '',
  limite_saldo: 0.0,
  obs: '',
  data_nascimento: null,
  codigo_fiador: '',
});

function clearFiador() {
  fiador.value = {
    id: 0,
    id_situacao_cliente: null,
    nome: '',
    fantasia: '',
    email: '',
    cpf_cnpj: '',
    rg: '',
    orgao_rg: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    tipo_pessoa: '',
    data_cadastro: null,
    sexo: '',
    logradouro: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    fone1: '',
    celular: '',
    contato: '',
    valor_fixo: 0.0,
    forma_pgto: '',
    dias_pgto: '',
    limite_saldo: 0.0,
    obs: '',
    data_nascimento: null,
    codigo_fiador:'',
  };
}

export { fiador, clearFiador };