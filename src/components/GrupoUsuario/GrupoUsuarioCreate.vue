<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Novo Grupo Usuário</h1>
          <v-form @submit.prevent="create" ref="form">
            <v-text-field
              v-model="grupo.descricao"
              label="Descrição"
              required
            ></v-text-field>           
  
            <v-btn
              color="primary"
              class="mr-4"
              @click="create"
            >
              Salvar
            </v-btn>
  
            <v-btn
              color="error"
              class="mr-4"
              @click="limpar"
            >
              Limpar
            </v-btn>
  
            <v-btn
              color="secondary"
              @click="voltar"
            >
              Voltar
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref,onMounted  } from 'vue';
  import axios from 'axios';

  import {grupoUsuario,clearGrupoUsuario} from '@/model/grupoUsuario.js';

  
  export default {
    setup(props,{ emit }) {
      const form = ref(null);
      const grupo = ref(grupoUsuario.value); // Inicializa grupo com o valor de grupoUsuario

      const create = async () => {
        if (form.value.validate()) {
        try {
          // Salvar o usuário primeiro
          const responseRequest = await axios.post('/api/GrupoUsuarios', grupo.value);

          if (responseRequest.status === 201) {
            emit('update'); // Emitir evento para fechar a modal
          } else {
            emit('error', { error: 'Erro ao salvar registro'}); // Emitir evento para fechar a modal
          }
        } catch (error) {
          emit('error', error); 
        }
      }
      };
  
      const limpar = () => {
        form.value.resetValidation();
        clearGrupoUsuario();
      };
  
      const voltar = () => {
        // Redirecionar para a lista de funcionários ou emitir evento de fechar modal
        emit('close'); // Emitir evento para fechar a modal
      };      

          // Função para inicializar o componente após a montagem
    const initialize = () => {
      // Limpar funcionario e usuario ao criar o componente
      limpar();
    };

    // Utilize onMounted para chamar a função initialize após o componente ser montado
    onMounted(initialize);
  
      return {
        grupo,
        clearGrupoUsuario,
        create,
        limpar,
        voltar,
        form
      };
    }
  };
  </script>
  