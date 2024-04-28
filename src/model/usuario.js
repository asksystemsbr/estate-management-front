import { ref } from 'vue';

// Define the funcionario object
const usuario = ref({
    id: 0,
    nome: '',
    senha: '',
    grupoUsuarioId: 0
  });

  function clearUsuario() {
    // Redefine todas as propriedades do objeto funcionario para seus valores iniciais
    usuario.value.id = 0;
    usuario.value.nome = '';
    usuario.value.senha = '';
    usuario.value.grupoUsuarioId = 0;
  }
// Export the object
export { usuario,clearUsuario};


