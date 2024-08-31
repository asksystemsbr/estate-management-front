<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Editar Locador</h1>
          <v-form @submit.prevent="updateLocador" ref="form">
            <v-text-field
              v-model="locador.codigo_locador"
              label="Código"
              required
            ></v-text-field>

            <v-text-field
              v-model="locador.nome"
              label="Nome"
              required
            ></v-text-field>
  
            <v-text-field
            v-model="locador.email"
            label="E-mail"
            required
            :rules="[validateEmail]"
          ></v-text-field>

          <v-text-field
            v-model="locador.cpf_cnpj"
            label="CPF/CNPJ"
            required
            @input="formatCpfCnpj"
          ></v-text-field>

          <v-select
            v-model="locador.sexo"
            :items="['Masculino', 'Feminino']"
            label="Sexo"
            required
          ></v-select>

          <v-text-field
            v-model="locador.logradouro"
            label="Logradouro"
            required
          ></v-text-field>

          <v-text-field
            v-model="locador.numero"
            label="Número"
            required
          ></v-text-field>

          <v-text-field
            v-model="locador.complemento"
            label="Complemento"
          ></v-text-field>

          <v-text-field
            v-model="locador.cep"
            label="CEP"
            required
            @input="formatCep"
          ></v-text-field>

          <v-text-field
            v-model="locador.bairro"
            label="Bairro"
            required
          ></v-text-field>

          <v-text-field
            v-model="locador.cidade"
            label="Cidade"
            required
          ></v-text-field>

          <v-text-field
            v-model="locador.uf"
            label="UF"
            required
            maxlength="2"
          ></v-text-field>

          <v-text-field
            v-model="locador.fone1"
            label="Telefone"
            @input="formatTelefone"
          ></v-text-field>

          <v-text-field
            v-model="locador.celular"
            label="Celular"
            @input="formatCelular"
          ></v-text-field>

          <v-text-field
            v-model="locador.contato"
            label="Contato"
          ></v-text-field>

          <v-textarea
            v-model="locador.obs"
            label="Observações"
          ></v-textarea>

          <v-text-field
              v-model="locador.pasta"
              label="Pasta"
              required
          ></v-text-field>
          <v-select
            v-model="locador.id_situacao_cliente"
            :items="situacoesCliente"
            item-title="descricao"
            item-value="id"
            label="Situação do Cliente"
            required
          ></v-select>            
  
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
  import { ref,onMounted,nextTick  } from 'vue';
  import axios from 'axios';
  
  import {locador,clearlocador} from '@/model/locador.js';
  
  export default {
    props: {
        id: {
      type: Number,
      required: true
    }
  },
    setup(props,{ emit }) {
      const form = ref(null);
      const situacoesCliente=ref([]);


      const fetchLocador = async () => {
      try {
        await fetchSituacaoCliente();
        console.log('Situações Cliente:', situacoesCliente.value);
        const response = await axios.get(`/api/Locador/${props.id}`);
        console.log('Dados do Locador Recebidos:', response.data);
        locador.value = response.data;

        await nextTick(); // Aguarda a atualização do DOM
        locador.value.id_situacao_cliente = response.data.iD_SITUACAO_CLIENTE;
        locador.value.cpf_cnpj = response.data.cpF_CNPJ;
        //console.log('ID Situação Cliente:', response.data.iD_SITUACAO_CLIENTE);
      } catch (error) {
        emit('error', error); 
      }
    };

    const updateLocador = async () => {
      try {
        await axios.put(`/api/Locador/${locador.value.id}`, locador.value);
        clearlocador();
        emit('update');
      } catch (error) {
        emit('error', error); 
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchLocador);     

      const fetchSituacaoCliente =async () => {
      try {
        const response = await axios.get(`/api/SituacaoCliente`);
        situacoesCliente.value = response.data.map(situacao => ({
        id: situacao.id,
        descricao: situacao.descricao
    }));
      } catch (error) {
        emit('error', error); 
      }
    };

      const formatTelefone = () => {
              // Aplica formatação automática para telefone (ex: (99) 9999-9999)
          let value = locador.value.fone1;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          locador.value.fone1 = value;
      };
  
      const formatCelular = () => {
            // Aplica formatação automática para celular (ex: (99) 99999-9999)
          let value = locador.value.celular;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{5})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          locador.value.celular = value;
      };
  
      const validateEmail = (value) => {
        // Lógica de validação de e-mail
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'E-mail inválido';
      };
      const formatCpfCnpj = () => {
            let value = locador.value.cpf_cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

            if (value.length <= 11) { // CPF
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else { // CNPJ
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }

            locador.value.cpf_cnpj = value;
        };

        const formatCep = () => {
            let value = locador.value.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            locador.value.cep = value;
        };
        
      return {
        locador,
        clearlocador,
        fetchLocador,
        updateLocador,
        closeModal,
        form,
        formatTelefone,
        formatCelular,
        validateEmail,
        formatCpfCnpj,
        formatCep,
        fetchSituacaoCliente,
        situacoesCliente
      };
    }
  };
  </script>
  