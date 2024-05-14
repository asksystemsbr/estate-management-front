<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Editar Funcionário</h1>
          <v-form @submit.prevent="updateFuncionario" ref="form">
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

import {funcionario,clearFuncionario} from '@/model/funcionario.js';
import {usuario,clearUsuario} from '@/model/usuario.js';
export default {
    props: {
        id: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }){
    const form = ref(null);   

    const fetchFuncionario = async () => {
      try {
        const responseFuncionario = await axios.get(`/api/Funcionarios/${props.id}`);
        funcionario.value = responseFuncionario.data;
        const responseUsuario = await axios.get(`/api/Usuarios/${funcionario.value.usuarioId}`);
        usuario.value = responseUsuario.data;
      } catch (error) {
        emit('error', error); 
      }
    };

    const updateFuncionario = async () => {
      try {
        await axios.put(`/api/Usuarios/${usuario.value.id}`, usuario.value);
        await axios.put(`/api/Funcionarios/${funcionario.value.id}`, funcionario.value);
        clearFuncionario();
        clearUsuario();
        emit('update');
      } catch (error) {
        emit('error', error); 
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchFuncionario);

    const formatTelefone = () => {
            // Aplica formatação automática para telefone (ex: (99) 9999-9999)
    let value = funcionario.value.Telefone;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
    funcionario.value.Telefone = value;
    };

    const formatCelular = () => {
      // Aplica formatação automática para celular (ex: (99) 99999-9999)
    let value = funcionario.value.Celular;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
    value = value.replace(/(\d)(\d{5})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
    funcionario.value.Celular = value;
    };

    const validateEmail = (value) => {
      // Lógica de validação de e-mail
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || 'E-mail inválido';
    };

    return {
      funcionario,
      clearFuncionario,
      usuario,
      clearUsuario,
      updateFuncionario,
      closeModal,
      form,
      formatTelefone,
      formatCelular,
      validateEmail
    };
  }
};
</script>
