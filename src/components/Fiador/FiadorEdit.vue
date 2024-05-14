<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Editar Fiador</h1>
          <v-form @submit.prevent="updateFiador" ref="form">
            <v-text-field
              v-model="fiador.codigo_fiador"
              label="Código"
              required
            ></v-text-field>
            <v-text-field
              v-model="fiador.nome"
              label="Nome"
              required
            ></v-text-field>
  
            <v-text-field
            v-model="fiador.email"
            label="E-mail"
            required
            :rules="[validateEmail]"
          ></v-text-field>

          <v-text-field
            v-model="fiador.cpf_cnpj"
            label="CPF/CNPJ"
            required
            @input="formatCpfCnpj"
          ></v-text-field>

          <v-select
            v-model="fiador.sexo"
            :items="['Masculino', 'Feminino']"
            label="Sexo"
            required
          ></v-select>

          <v-text-field
            v-model="fiador.logradouro"
            label="Logradouro"
            required
          ></v-text-field>

          <v-text-field
            v-model="fiador.numero"
            label="Número"
            required
          ></v-text-field>

          <v-text-field
            v-model="fiador.complemento"
            label="Complemento"
          ></v-text-field>

          <v-text-field
            v-model="fiador.cep"
            label="CEP"
            required
            @input="formatCep"
          ></v-text-field>

          <v-text-field
            v-model="fiador.bairro"
            label="Bairro"
            required
          ></v-text-field>

          <v-text-field
            v-model="fiador.cidade"
            label="Cidade"
            required
          ></v-text-field>

          <v-text-field
            v-model="fiador.uf"
            label="UF"
            required
            maxlength="2"
          ></v-text-field>

          <v-text-field
            v-model="fiador.fone1"
            label="Telefone"
            @input="formatTelefone"
          ></v-text-field>

          <v-text-field
            v-model="fiador.celular"
            label="Celular"
            @input="formatCelular"
          ></v-text-field>

          <v-text-field
            v-model="fiador.contato"
            label="Contato"
          ></v-text-field>

          <v-textarea
            v-model="fiador.obs"
            label="Observações"
          ></v-textarea>

          <v-select
            v-model="fiador.id_situacao_cliente"
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
  
  import {fiador,clearFiador} from '@/model/fiador.js';
  
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


      const fetchFiador = async () => {
      try {
        await fetchSituacaoCliente();
        console.log('Situações Cliente:', situacoesCliente.value);
        const response = await axios.get(`/api/Fiador/${props.id}`);
        console.log('Dados do Fiador Recebidos:', response.data);
        fiador.value = response.data;

        await nextTick(); // Aguarda a atualização do DOM
        fiador.value.id_situacao_cliente = response.data.iD_SITUACAO_CLIENTE;
        fiador.value.cpf_cnpj = response.data.cpF_CNPJ;
        //console.log('ID Situação Cliente:', response.data.iD_SITUACAO_CLIENTE);
      } catch (error) {
        emit('error', error); 
      }
    };

    const updateFiador = async () => {
      try {
        await axios.put(`/api/Fiador/${fiador.value.id}`, fiador.value);
        clearFiador();
        emit('update');
      } catch (error) {
        emit('error', error); 
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchFiador);     

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
          let value = fiador.value.fone1;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          fiador.value.fone1 = value;
      };
  
      const formatCelular = () => {
            // Aplica formatação automática para celular (ex: (99) 99999-9999)
          let value = fiador.value.celular;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{5})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          fiador.value.celular = value;
      };
  
      const validateEmail = (value) => {
        // Lógica de validação de e-mail
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'E-mail inválido';
      };
      const formatCpfCnpj = () => {
            let value = fiador.value.cpf_cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

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

            fiador.value.cpf_cnpj = value;
        };

        const formatCep = () => {
            let value = fiador.value.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            fiador.value.cep = value;
        };
        
      return {
        fiador,
        clearFiador,
        fetchFiador,
        updateFiador,
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
  