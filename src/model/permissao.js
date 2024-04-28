import { ref } from 'vue';

const permissao = ref({
  id: 0,
  tipoPermissaoId: null,
  moduloId: null,
  grupoUsuarioId: null
});

function clearPermissoes() {    
  permissao.value.id = 0;
  permissao.value.tipoPermissaoId = null;    
  permissao.value.moduloId = null;   
  permissao.value.grupoUsuarioId = null;   
  }

export { permissao,clearPermissoes};