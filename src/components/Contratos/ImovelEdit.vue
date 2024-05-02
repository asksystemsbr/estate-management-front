<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Novo Imóvel</h1>
        <v-form @submit.prevent="updateImovel" ref="form">

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
            {{ console.log('Activator on:', on) }}
            <v-text-field
              v-model="formattedDate"
              label="Data de Vencimento"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              @click="() => customClickHandler()" 
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
  import { ref,onMounted,nextTick,computed  } from 'vue';
  import axios from 'axios';
  
  import { imovel, clearImovel } from '@/model/imovel.js';
  
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
      const clienteCadastrado=ref([]);
      const menuOpen  = ref(false);

      const fetchImovel = async () => {
      try {
        await fetchSituacaoCliente();
        console.log('Situações Cliente:', situacoesCliente.value);
        await fetchCliente();
        console.log('Cliente:', clienteCadastrado.value);
        const response = await axios.get(`/api/Imovels/${props.id}`);
        console.log('Dados do imovel Recebidos:', response.data);
        imovel.value = response.data;

        await nextTick(); // Aguarda a atualização do DOM
        imovel.value.situacaoId = response.data.iD_SITUACAO_CLIENTE;
        imovel.value.situacaoId = response.data.clienteId;
        imovel.value.dataVencimento =new Date(response.data.dataVencimento);
        console.log ('Imovel data vencimento:', imovel.value.dataVencimento);
        //console.log('ID Situação Cliente:', response.data.iD_SITUACAO_CLIENTE);
      } catch (error) {
        emit('error', error); 
      }
    };

    const updateImovel = async () => {
      try {
        await axios.put(`/api/Imovels/${imovel.value.id}`, imovel.value);
        clearImovel();
        emit('update');
      } catch (error) {
        emit('error', error); 
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchImovel);     

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
  


        const formatCep = () => {
            let value = imovel.value.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            imovel.value.cep = value;
        };
        
        const formattedDate = computed(() => {
          const date = new Date(imovel.value.dataVencimento);
          return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString('pt-BR')
            : '';
        });

      const customClickHandler = () => {
        menuOpen.value = true;
        // if (on && on.click) {
        //   on.click();  // Ensures that the function exists before calling it
        //}
      };
      const handleOn = (on) => {
        console.log('My on:', on); // Logs the object to the console
        return on; // Returns the object so it can still be used in the template
    }
       function handleDateChange(value) {
          // Check if value is already a Date object
          if (!(value instanceof Date)) {
            value = new Date(value);
            if (isNaN(value.getDate())) {
              console.error('Invalid date received:', value);
              return; // Early return if date is still invalid
            }
          }
          imovel.value.dataVencimento = value;
          menuOpen.value = false;  // Close the menu after selecting the date
        }

      return {
        imovel,
        clearImovel,
        fetchImovel,
        updateImovel,
        closeModal,
        form,
        formatCep,
        fetchSituacaoCliente,
        situacoesCliente,
        clienteCadastrado,
        formattedDate,
        menuOpen,
        handleDateChange,
        customClickHandler,
        handleOn
      };
    }
  };
  </script>
  