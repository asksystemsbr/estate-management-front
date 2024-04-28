import { ref } from 'vue';

const client = ref({
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
  fone2: '',
  celular: '',
  contato: '',
  codigo_ibge_cidade: null,
  codigo_ibge_uf: null,
  data_ultima_compra: null,
  ultimanfe: '',
  ultimaos: '',
  placa: '',
  mensalista: '',
  conveniado: '',
  desconto1hora: '',
  desconto2hora: '',
  turno: '',
  pontos: '',
  valor_fixo: 0,
  forma_pgto: '',
  dias_pgto: '',
  funcionario_id: null,
  limite_saldo: 0,
  obs: '',
  data_nascimento: null
});

function clearClient() {
  client.value.id = 0;
  client.value.id_situacao_cliente = null;
  client.value.nome = '';
  client.value.fantasia = '';
  client.value.email = '';
  client.value.cpf_cnpj = '';
  client.value.rg = '';
  client.value.orgao_rg = '';
  client.value.inscricao_estadual = '';
  client.value.inscricao_municipal = '';
  client.value.tipo_pessoa = '';
  client.value.data_cadastro = null;
  client.value.sexo = '';
  client.value.logradouro = '';
  client.value.numero = '';
  client.value.complemento = '';
  client.value.cep = '';
  client.value.bairro = '';
  client.value.cidade = '';
  client.value.uf = '';
  client.value.fone1 = '';
  client.value.fone2 = '';
  client.value.celular = '';
  client.value.contato = '';
  client.value.codigo_ibge_cidade = null;
  client.value.codigo_ibge_uf = null;
  client.value.data_ultima_compra = null;
  client.value.ultimanfe = '';
  client.value.ultimaos = '';
  client.value.placa = '';
  client.value.mensalista = '';
  client.value.conveniado = '';
  client.value.desconto1hora = '';
  client.value.desconto2hora = '';
  client.value.turno = '';
  client.value.pontos = '';
  client.value.valor_fixo = 0;
  client.value.forma_pgto = '';
  client.value.dias_pgto = '';
  client.value.funcionario_id = null;
  client.value.limite_saldo = 0;
  client.value.obs = '';
  client.value.data_nascimento = null;
}

export { client, clearClient };