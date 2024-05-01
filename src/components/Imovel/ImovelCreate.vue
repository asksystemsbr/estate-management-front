<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1>Novo Imóvel</h1>
          <v-form @submit.prevent="createImovel" ref="form">

            <v-select
                v-model="imovel.clienteId"
                :items="clienteCadastrado"
                item-title="nome"
                item-value="id"
                label="Cliente"
                required
            ></v-select>  

            <v-text-field
              v-model="imovel.logradouro"
              label="Logradouro"
              required
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.numero"
              label="Número"
              required
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.complemento"
              label="Complemento"
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.cep"
              label="CEP"
              required
              @input="formatCep"
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.bairro"
              label="Bairro"
              required
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.cidade"
              label="Cidade"
              required
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.uf"
              label="UF"
              required
              maxlength="2"
            ></v-text-field>
  
            <v-text-field
              v-model="imovel.valor"
              label="Valor"
              required
              type="number"
            ></v-text-field>
  
        <v-menu
            ref="menu"
            v-model="menuOpen"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
        >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formattedDate"
                label="Data de Vencimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                @click="menuOpen = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="imovel.dataVencimento"
              @input="handleDateChange"
              @update:modelValue ="handleDateChange"
              no-title
            ></v-date-picker>
        </v-menu>

            <v-text-field
              v-model="imovel.reajuste"
              label="Reajuste"
              type="number"
            ></v-text-field>
  
            <v-textarea
              v-model="imovel.obs"
              label="Observações"
            ></v-textarea>

          <v-select
                v-model="imovel.situacaoId"
                :items="situacoesCliente"
                item-title="descricao"
                item-value="id"
                label="Situação do Imóvel"
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
              @click="clearImovel"
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
  import { ref, onMounted,computed } from 'vue';
  import axios from 'axios';
  
  import { imovel, clearImovel } from '@/model/imovel.js';
  
  export default {
    setup(props, { emit }) {
      const form = ref(null);
      const situacoesCliente=ref([]);
      const clienteCadastrado=ref([]);
      const menuOpen  = ref(false);

      const createImovel = async () => {
        if (form.value.validate()) {
          try {
            await axios.post('/api/Imovels', imovel.value);
            emit('update'); // Emitir evento para fechar a modal ou atualizar a lista
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

    const fetchCliente =async () => {
      try {
            const response = await axios.get(`/api/Cliente`);
            clienteCadastrado.value = response.data.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome
        }));

      } catch (error) {
        emit('error', error);
      }
    };

    const limpar = () => {
        form.value.resetValidation();
        clearImovel();
      };

      const voltar = () => {
        emit('close'); // Emitir evento para fechar a modal ou voltar para a lista de imóveis
      };
  
      const formatCep = () => {
        let value = imovel.value.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        imovel.value.cep = value;
      };

      const formattedDate = computed(() => {
        return imovel.value.dataVencimento
            ? new Date(imovel.value.dataVencimento).toLocaleDateString('pt-BR')
            : '';
       });

       function handleDateChange(value) {
            imovel.value.dataVencimento = value;
            menuOpen.value = false;  // Fecha o menu após selecionar a data
        }

    // Função para inicializar o componente após a montagem
    const initialize = async () => {
      await fetchSituacaoCliente();
      await fetchCliente();
      limpar();
    };
  
        // Utilize onMounted para chamar a função initialize após o componente ser montado
        onMounted(initialize);

      return {
        imovel,
        clearImovel,
        createImovel,
        voltar,
        form,
        formatCep,
        clienteCadastrado,
        situacoesCliente,
        formattedDate,
        menuOpen,
        handleDateChange,
      };
    }
  };
  </script>
  