<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Novo Cliente</h1>
          <v-form @submit.prevent="createClient" ref="form">
            <v-text-field
              v-model="client.codigo_cliente"
              label="Código"
              required
            ></v-text-field>

            <v-text-field
              v-model="client.nome"
              label="Nome"
              required
            ></v-text-field>
  
            <v-text-field
            v-model="client.email"
            label="E-mail"
            required
            :rules="[validateEmail]"
          ></v-text-field>

          <v-text-field
            v-model="client.cpf_cnpj"
            label="CPF/CNPJ"
            required
            @input="formatCpfCnpj"
          ></v-text-field>

          <v-select
            v-model="client.sexo"
            :items="['Masculino', 'Feminino']"
            label="Sexo"
            required
          ></v-select>

          <v-text-field
            v-model="client.logradouro"
            label="Logradouro"
            required
          ></v-text-field>

          <v-text-field
            v-model="client.numero"
            label="Número"
            required
          ></v-text-field>

          <v-text-field
            v-model="client.complemento"
            label="Complemento"
          ></v-text-field>

          <v-text-field
            v-model="client.cep"
            label="CEP"
            required
            @input="formatCep"
          ></v-text-field>

          <v-text-field
            v-model="client.bairro"
            label="Bairro"
            required
          ></v-text-field>

          <v-text-field
            v-model="client.cidade"
            label="Cidade"
            required
          ></v-text-field>

          <v-text-field
            v-model="client.uf"
            label="UF"
            required
            maxlength="2"
          ></v-text-field>

          <v-text-field
            v-model="client.fone1"
            label="Telefone"
            @input="formatTelefone"
          ></v-text-field>

          <v-text-field
            v-model="client.celular"
            label="Celular"
            @input="formatCelular"
          ></v-text-field>

          <v-text-field
            v-model="client.contato"
            label="Contato"
          ></v-text-field>

          <v-textarea
            v-model="client.obs"
            label="Observações"
          ></v-textarea>

          <v-select
            v-model="client.id_situacao_cliente"
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
  
  import {client,clearClient} from '@/model/cliente.js';
  
  export default {
    setup(props,{ emit }) {
      const form = ref(null);
      const situacoesCliente=ref([]);
      const createClient = async () => {
        if (form.value.validate()) {
        try {
            await axios.post('/api/Cliente', client.value);
            emit('update'); // Emitir evento para fechar a modal
        } catch (error) {
          emit('error', error); 
        }
      }
      };
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

      const limpar = () => {
        form.value.resetValidation();
        clearClient();
      };
  
      const voltar = () => {
        // Redirecionar para a lista de funcionários ou emitir evento de fechar modal
        emit('close'); // Emitir evento para fechar a modal
      };
  
      const formatTelefone = () => {
              // Aplica formatação automática para telefone (ex: (99) 9999-9999)
          let value = client.value.fone1;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          client.value.fone1 = value;
      };
  
      const formatCelular = () => {
            // Aplica formatação automática para celular (ex: (99) 99999-9999)
          let value = client.value.celular;
          value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
          value = value.replace(/(\d)(\d{5})$/, '$1-$2'); // Adiciona hífen entre os últimos dígitos
          client.value.celular = value;
      };
  
      const validateEmail = (value) => {
        // Lógica de validação de e-mail
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'E-mail inválido';
      };
      const formatCpfCnpj = () => {
            let value = client.value.cpf_cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

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

            client.value.cpf_cnpj = value;
        };

        const formatCep = () => {
            let value = client.value.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            client.value.cep = value;
        };

          // Função para inicializar o componente após a montagem
    const initialize = () => {
      fetchSituacaoCliente();
      limpar();
    };

    // Utilize onMounted para chamar a função initialize após o componente ser montado
    onMounted(initialize);
  
      return {
        client,
        clearClient,
        createClient,
        limpar,
        voltar,
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
  