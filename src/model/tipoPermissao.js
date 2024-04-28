import { ref } from 'vue';

const tipoPermissao = ref({
  id: 0,
  descricao: ''
});

function clearTipoPermissao() {    
  tipoPermissao.value.id = 0;
  tipoPermissao.value.descricao = '';    
  }

export { tipoPermissao,clearTipoPermissao};