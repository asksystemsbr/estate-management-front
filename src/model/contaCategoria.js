import { ref } from 'vue';

const contaCategoria = ref({
  id: 0,
  descricao: ''
});

function clearContaCategoria() {    
  contaCategoria.value = {
    id: 0,
    descricao: ''    
    };
  }

export { contaCategoria,clearContaCategoria};