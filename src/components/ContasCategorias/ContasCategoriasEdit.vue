<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Editar Categoria de Conta</h1>
          <v-form @submit.prevent="updateTipo" ref="form">
            <v-text-field
              v-model="contaCategoria.descricao"
              label="Descrição"
              required
              :rules="[v => !!v || 'Campo obrigatório']"
            ></v-text-field>
  
            <v-btn
              color="primary"
              class="mr-4"
              type="submit"
            >
              Salvar
            </v-btn>
  
            <v-btn color="secondary" @click="closeModal">Cancelar</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import {contaCategoria,clearContaCategoria} from '@/model/contaCategoria.js';
  
  export default {
    props: {
        tipoId: {
            type: Number,
            required: true
        }
    },
  setup(props, { emit }) {
    const form = ref(null);
    //const tipoLocal = ref({ });
      
  
      const fetchTipo = async () => {
        try {
            const response = await axios.get(`/api/ContaCategoria/${props.tipoId}`);
            contaCategoria.value = response.data ;
        } catch (error) {
          console.error('Erro ao buscar dados do registro:', error);
          emit('error', error); 
        }
      };
  
      const updateTipo = async () => {
        try {
          if (!contaCategoria.value || !contaCategoria.value.id) {
          emit('error', {error:'Registro inválido'}); 
          return;
        }
            await axios.put(`/api/ContaCategoria/${props.tipoId}`, contaCategoria.value);
            clearContaCategoria();
            emit('update'); // Emitir evento para fechar a modal            
        } catch (error) {
          console.error('Erro ao atualizar registro:', error);
          emit('error', error); 
        }
      };    
  
    //   return { updateTipo, voltar, form };
    const closeModal = () => {
      emit('close'); // Emitir evento para fechar a modal
    };

    onMounted(() => {
      fetchTipo();
    });

    return {
      contaCategoria,
      clearContaCategoria,
      updateTipo,
      closeModal,
      form
    };
    }
  };
  </script>