<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Editar Tipo de Pagamento</h1>
          <v-form @submit.prevent="updateTipo" ref="form">
            <v-text-field
              v-model="tipoPagamento.descricao"
              label="Descrição"
              required
              :rules="[v => !!v || 'Campo obrigatório']"
            ></v-text-field>
  
            <v-text-field
              v-model="tipoPagamento.codigo"
              label="Código"
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
  import {tipoPagamento,clearTipoPagamento} from '@/model/tipoPagamento.js';
  
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
            const response = await axios.get(`/api/TipoPagamento/${props.tipoId}`);
            tipoPagamento.value = response.data ;
        } catch (error) {
          console.error('Erro ao buscar dados do registro:', error);
          emit('error', error); 
        }
      };
  
      const updateTipo = async () => {
        try {
          if (!tipoPagamento.value || !tipoPagamento.value.id) {
          emit('error', {error:'Registro inválido'}); 
          return;
        }
            await axios.put(`/api/TipoPagamento/${props.tipoId}`, tipoPagamento.value);
            clearTipoPagamento();
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
      tipoPagamento,
      clearTipoPagamento,
      updateTipo,
      closeModal,
      form
    };
    }
  };
  </script>