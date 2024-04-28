<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Novo Funcionário</h1>
          <v-form @submit.prevent="createFuncionario" ref="form">
            <v-text-field
              v-model="funcionario.nome"
              label="Nome"
              required
            ></v-text-field>
  
            <v-text-field
              v-model="funcionario.telefone"
              label="Telefone"
              required
              @input="formatTelefone"
            ></v-text-field>
  
            <v-text-field
              v-model="funcionario.celular"
              label="Celular"
              required
              @input="formatCelular"
            ></v-text-field>
  
            <v-text-field
              v-model="funcionario.email"
              label="E-mail"
              required
              :rules="[validateEmail]"
            ></v-text-field>
  
            <v-text-field
              v-model="usuario.nome"
              label="Nome de Usuário"
              required
            ></v-text-field>

            <v-text-field
              v-model="usuario.senha"
              label="Senha de Usuário"
              required
              type="password"
            ></v-text-field>
  
            <v-btn
              color="primary"
              class="mr-4"
              @click="createFuncionario"
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
  // Import the funcionario object from the separate module
  import {funcionario,clearFuncionario} from '@/model/funcionario.js';
import {usuario,clearUsuario} from '@/model/usuario.js';
  
  export default {
    setup(props,{ emit }) {
      const form = ref(null);
      const createFuncionario = async () => {
        if (form.value.validate()) {
        try {
          // Salvar o usuário primeiro
          const responseUsuario = await axios.post('/api/Usuarios', usuario.value);

          if (responseUsuario.status === 201) {
            const usuarioSalvo = responseUsuario.data; // Usuário salvo com sucesso

            // Associar o ID do usuário salvo ao funcionário
            funcionario.value.usuarioId = usuarioSalvo.id;

            // Salvar o funcionário com o código de usuário associado
            await axios.post('/api/Funcionarios', funcionario.value);
            emit('update'); // Emitir evento para fechar a modal
          } else {
            emit('error', 'Erro ao salvar o funcionário');  // Emitir evento para fechar a modal
          }
        } catch (error) {
          emit('error', error); 
        }
      }
      };
  
      const limpar = () => {
        form.value.resetValidation();
        clearFuncionario();
        clearUsuario();
      };
  
      const voltar = () => {
        // Redirecionar para a lista de funcionários ou emitir evento de fechar modal
        emit('close'); // Emitir evento para fechar a modal
      };
  
      const formatTelefone = () => {
              // Aplica formatação automática para telefone (ex: (99) 9999-9999)
          let value = funcionario.value.telefone;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          funcionario.value.telefone = value;
      };
  
      const formatCelular = () => {
            // Aplica formatação automática para celular (ex: (99) 99999-9999)
          let value = funcionario.value.celular;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{5})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          funcionario.value.celular = value;
      };
  
      const validateEmail = (value) => {
        // Lógica de validação de e-mail
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'E-mail inválido';
      };

          // Função para inicializar o componente após a montagem
    const initialize = () => {
      // Limpar funcionario e usuario ao criar o componente
      limpar();
    };

    // Utilize onMounted para chamar a função initialize após o componente ser montado
    onMounted(initialize);
  
      return {
        funcionario,
        clearFuncionario,
        usuario,
        clearUsuario,
        createFuncionario,
        limpar,
        voltar,
        form,
        formatTelefone,
        formatCelular,
        validateEmail
      };
    }
  };
  </script>
  