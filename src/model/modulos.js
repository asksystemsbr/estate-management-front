import { ref } from 'vue';

const modulos = ref({
  id: 0,
  descricao: ''
});

function clearModulos() {    
  modulos.value.id = 0;
  modulos.value.descricao = '';    
  }

export { modulos,clearModulos};