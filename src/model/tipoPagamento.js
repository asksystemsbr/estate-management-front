import { ref } from 'vue';

const tipoPagamento = ref({
  id: 0,
  descricao: ''
});

function clearTipoPagamento() {    
  tipoPagamento.value = {
    id: 0,
    descricao: ''    
    };
  }

export { tipoPagamento,clearTipoPagamento};