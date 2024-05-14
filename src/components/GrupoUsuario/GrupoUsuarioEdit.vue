<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Editar Grupo Usuário</h1>
          <v-form @submit.prevent="update" ref="form">
            <v-text-field
              v-model="grupoUsuario.descricao"
              label="Descrição"
              required
            ></v-text-field>           
  
            <v-btn
            color="primary"
            class="mr-4"
            type="submit"
          >
            Salvar
          </v-btn>
  
            <v-btn
              color="secondary"
              @click="closeModal"
            >
              Voltar
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>

  
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import {grupoUsuario,clearGrupoUsuario} from '@/model/grupoUsuario.js';

export default {
    props: {
        id: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }){
    const form = ref(null);   
    //const grupoLocal = ref({}); // Cópia local para evitar mutação direta
    
    const fetch = async () => {
      try {
        const responseRequest = await axios.get(`/api/GrupoUsuarios/${props.id}`);
        grupoUsuario.value = responseRequest.data;
      } catch (error) {
        console.error('Erro ao buscar dados do registro:', error);
        emit('error', error); 
      }
    };

    const update = async () => {
      try {        
        if (!grupoUsuario.value || !grupoUsuario.value.id) {
          emit('error', {error:'Registro inválido'}); 
          return;
        }
        await axios.put(`/api/GrupoUsuarios/${grupoUsuario.value.id}`, grupoUsuario.value);
        clearGrupoUsuario();
        emit('update');
      } catch (error) {
        console.error('Erro ao atualizar registro:', error);
        emit('error', error); 
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetch);    

    return {
      grupoUsuario,
      clearGrupoUsuario,
      update,
      closeModal,
      form
    };
  }
};
</script>
