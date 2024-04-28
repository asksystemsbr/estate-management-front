import { ref } from 'vue';

const grupoUsuario = ref({
  id: 0,
  descricao: ''
});

function clearGrupoUsuario() {    
    grupoUsuario.value.id = 0;
    grupoUsuario.value.descricao = '';    
  }

export { grupoUsuario,clearGrupoUsuario};