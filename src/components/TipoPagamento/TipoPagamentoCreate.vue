<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Novo Tipo de Pagamento</h1>
          <v-form @submit.prevent="createTipo" ref="form">
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
              @click="createTipo"
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
  import { ref,onMounted } from 'vue';
  import axios from 'axios';
  import {tipoPagamento,clearTipoPagamento} from '@/model/tipoPagamento.js';

  export default {
    setup(props,{ emit }) {
      const form = ref(null);
      //const tiposPagamentos = ref(tipoPagamento.value); // Inicializa com o valor 
  
      const createTipo = async () => {
        if (form.value.validate()) {
          try {
            const responseRequest = await axios.post('/api/TipoPagamento', tipoPagamento.value);
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
        clearTipoPagamento();
      };
                // Função para inicializar o componente após a montagem
    const initialize = () => {
      // Limpar funcionario e usuario ao criar o componente
      limpar();
    };

          // Utilize onMounted para chamar a função initialize após o componente ser montado
    onMounted(initialize);
  
      const voltar = () => {    
        //router.push({ name: 'TipoPagamentosList' });    
        emit('close'); // Emitir evento para fechar a modal
      };
    
      return { tipoPagamento, createTipo, limpar,voltar, form };
    }
  };
  </script>
  