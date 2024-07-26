import { ref } from 'vue';

const contaSubCategorias = ref({
  id: 0,
  descricao: '',
  contasCategoriasId: 0
});

function clearContaSubCategorias() {    
  contaSubCategorias.value = {
    id: 0,
    descricao: '',
    contasCategoriasId: 0
    };
  }

export { contaSubCategorias,clearContaSubCategorias};