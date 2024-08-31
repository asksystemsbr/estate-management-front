<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Nova Conta - {{ titulo }}</h1>
        <v-form @submit.prevent="createTipo" ref="form">
          <v-row align="center" justify="center">
            <v-col cols="12" md="12">
              <v-select
                v-model="selectedImovelId"
                :items="imoveisDisponiveis"
                label="Selecione um Imóvel"
                item-title="codigoImovel"
                item-value="id"
                :error-messages="!validaImovel ? '' : 'Selecione uma imóvel válido'"
              ></v-select>
            </v-col>
          </v-row>   
          <!-- <v-row v-if="titulo ==='PAGAR'" align="center" justify="center">         -->
          <v-row align="center" justify="center">        
              <v-col cols="12" md="12">
              <v-select
                v-model="selectedLocadorId"
                :items="locadoresDisponiveis"
                label="Selecione um Locador"
                item-title="codigoLocador"
                item-value="id"  
                :error-messages="!validaCliente ? '' : 'Selecione um Locador válido'"     
              ></v-select>
            </v-col>
          </v-row>
          <!-- <v-row  v-if="titulo ==='RECEBER'" align="center" justify="center">         -->
            <v-row  align="center" justify="center">                    
              <v-col cols="12" md="12">
              <v-select
                v-model="selectedLocatarioId"
                :items="locatariosDisponiveis"
                label="Selecione um Locatário"
                item-title="codigoLocatario"
                item-value="id"  
                :error-messages="!validaCliente ? '' : 'Selecione um Locatário válido'"     
              ></v-select>
            </v-col>
          </v-row>                               
          <v-row align="center" justify="center">
            <v-col cols="12" md="12">
              <v-select
                v-model="selectedCategoriaId"
                :items="categoriasDisponiveis"
                label="Selecione uma Categoria"
                item-title="descricao"
                item-value="id"
                @update:model-value="handleCategoriaSelectClick"
                :error-messages="!validaCategoria ? '' : 'Selecione uma categoria válida'"
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col cols="12" md="12">
              <v-select
                v-model="selectedSubCategoriaId"
                :items="subCategoriasDisponiveis"
                label="Selecione uma SubCategoria"
                item-title="descricao"
                item-value="id"
                :error-messages="!validaSubCategoria ? '' : 'Selecione uma sub categoria válida'"
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col cols="12" md="12">
              <v-select
                v-model="selectedTipoPagamentoId"
                :items="tiposPagamentosDisponiveis"
                label="Selecione um Pagamento"
                item-title="descricao"
                item-value="id"
                :error-messages="!validaTipoPagamento ? '' : 'Selecione um pagamento válido'"
              ></v-select>
            </v-col>
          </v-row>
          <v-text-field
            v-model="contas.contaNome"
            label="Descrição"
            required
            :rules="[v => !!v || 'Campo obrigatório']"
          ></v-text-field>
          <v-text-field
            v-model="contas.valor"
            label="Valor"
            required
            :rules="[v => !!v || 'Campo obrigatório']"
          ></v-text-field>
          <v-menu
            ref="menu"
            v-model="menuOpenEnd"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ attrs }">
              <v-text-field
                v-model="formattedDateEnd"
                label="Data Vencimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                @click="menuOpenEnd = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="contas.dtVencimento"
              @input="handleDateChangeStartInsure"
              @update:modelValue="handleDateChangeStartInsure"
              no-title
            ></v-date-picker>
          </v-menu>
          <v-btn color="primary" class="mr-4" @click="createTipo">
            Salvar
          </v-btn>
          <v-btn color="error" class="mr-4" @click="limpar">
            Limpar
          </v-btn>
          <v-btn color="secondary" @click="voltar">
            Voltar
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
            Fechar
          </v-btn>
        </template>
      </v-snackbar>
  </v-container>
</template>

<script>
import { ref, computed, onBeforeMount, onMounted,watch } from 'vue';
import axios from 'axios';
import { contas, clearContas } from '@/model/contas.js';

export default {
  props: {
    titulo: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = ref(null);
    const menuOpenEnd = ref(false);
    const selectedImovelId = ref(0);    
    const selectedCategoriaId = ref(0);
    const selectedSubCategoriaId = ref(0);
    const selectedTipoPagamentoId = ref(0);
    const imoveisDisponiveis = ref([]);
    const categoriasDisponiveis = ref([]);
    const subCategoriasDisponiveis = ref([]);
    const tiposPagamentosDisponiveis = ref([]);
    const validaImovel = ref(false);
    const validaCategoria = ref(false);
    const validaSubCategoria = ref(false);
    const validaTipoPagamento = ref(false);
    const selectedLocatarioId = ref(0);
    const selectedLocadorId = ref(0);   
    const locatariosDisponiveis = ref([]);
    const locadoresDisponiveis = ref([]); 
    const selectedClientId = ref(0);
    const validaCliente = ref(false);
    const snackbar = ref({
            show: false,
            message: '',
            color: '',
            timeout: 3000
        });
    const createTipo = async () => {
      if (form.value.validate()) {
        try {
          validaImovel.value = false;
          validaCategoria.value = false;
          validaSubCategoria.value = false;
          validaTipoPagamento.value = false;

          if (!selectedImovelId.value) {
            validaImovel.value = true;
          }
          if (!selectedCategoriaId.value) {
            validaCategoria.value = true;
          }
          if (!selectedSubCategoriaId.value) {
            validaSubCategoria.value = true;
          }
          if (!selectedTipoPagamentoId.value) {
            validaTipoPagamento.value = true;
          }
          if (!selectedLocatarioId.value) {
            validaCliente.value = true;
          }

          if (
            validaImovel.value ||
            validaCategoria.value ||
            validaSubCategoria.value ||
            validaTipoPagamento.value ||
            validaCliente.value 
          ) {
            await showSnackBar(`Verifique os campos necessários`, 'error');
            return;
          }

          contas.value.imovelId = selectedImovelId.value;
          contas.value.categoriaId = selectedCategoriaId.value;
          contas.value.subCategoriaId = selectedSubCategoriaId.value;
          contas.value.formaPagamentoId = selectedTipoPagamentoId.value;          
          contas.value.ClienteId = selectedLocatarioId.value;
          contas.value.locadorId = selectedLocadorId.value;
          contas.value.tipo = props.titulo;

          const responseRequest = await axios.post('/api/Conta', contas.value);
          if (responseRequest.status === 201) {
            emit('update');
          } else {
            emit('error', { error: 'Erro ao salvar registro' });
          }
        } catch (error) {
          emit('error', error);
        }
      }
    };

    const fetchImovel = async () => {
      try {
        const response = await axios.get(`/api/Imovels`);
        imoveisDisponiveis.value = response.data.map(imovel => ({
          id: imovel.id,
          codigoImovel: imovel.codigoImovel,
        }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    };

    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`/api/ContaCategoria`);
        categoriasDisponiveis.value = response.data.map(categoria => ({
          id: categoria.id,
          descricao: categoria.descricao,
        }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    };

    const fetchSubCategoria = async () => {
      try {
        const response = await axios.get(`/api/ContaSubCategoria/getcontassubcategoriascategoria/${selectedCategoriaId.value}`);
        subCategoriasDisponiveis.value = response.data.map(subCategoria => ({
          id: subCategoria.id,
          descricao: subCategoria.descricao,
        }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    };

    const fetchPagamento = async () => {
      try {
        const response = await axios.get(`/api/TipoPagamento`);
        tiposPagamentosDisponiveis.value = response.data.map(tipoPagamento => ({
          id: tipoPagamento.id,
          descricao: tipoPagamento.descricao,
        }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    };

    const fetchLocatarios = async () => {
        try {
          if (selectedImovelId.value) {
            const response = await axios.get(`/api/Imovels/getimovelcliente/${selectedImovelId.value}`);
            locatariosDisponiveis.value = response.data.map(locatario => ({
              id: locatario.id,
              codigoLocatario: locatario.nome
            }));
          }
        } catch (error) {
          emit('error', error);
        }
      };

      const fetchLocadores = async () => {
        try {
          if (selectedImovelId.value) {
            const response = await axios.get(`/api/Imovels/getimovellocador/${selectedImovelId.value}`);
            locadoresDisponiveis.value = response.data.map(locador => ({
              id: locador.id,
              codigoLocador: locador.nome
            }));
          }
        } catch (error) {
          emit('error', error);
        }
      };

      // Carregar locatários ou locadores quando o imóvel for selecionado
      watch(selectedImovelId, async () => {
        //if (props.titulo === 'PAGAR') {
          await fetchLocadores();
        //} else if (props.titulo === 'RECEBER') {
          await fetchLocatarios();
        //}
      });

      watch([selectedLocatarioId, selectedLocadorId], () => {
        //if (props.titulo === 'PAGAR') {
          contas.value.ClienteId = selectedLocatarioId.value;
        //} else if (props.titulo === 'RECEBER') {
          contas.value.locatarioId = selectedLocadorId.value;
        //}
      });

    const limpar = () => {
      if (form.value) {
        form.value.resetValidation();
        clearContas();
      }
      selectedImovelId.value = 0;
      selectedCategoriaId.value = 0;
      selectedSubCategoriaId.value = 0;
      selectedTipoPagamentoId.value = 0;
      selectedLocadorId.value = 0;
      selectedLocatarioId.value = 0;
      selectedClientId.value = 0;
    };

    const handleCategoriaSelectClick = () => {
      fetchSubCategoria();
    };

    const formattedDateEnd = computed(() => {
      return contas.value.dtVencimento
        ? new Date(contas.value.dtVencimento).toLocaleDateString('pt-BR')
        : '';
    });

    const handleDateChangeStartInsure = value => {
      contas.value.dtVencimento = value;
      menuOpenEnd.value = false;
    };
    const showSnackBar = (message,color) => 
    {
      snackbar.value.message = message;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };
    const initialize = () => {
      limpar();
      fetchImovel();
      fetchCategoria();
      fetchSubCategoria();
      fetchPagamento();
    };

    onBeforeMount(() => {
      clearContas();
    });

    onMounted(initialize);

    const voltar = () => {
      emit('close');
    };

    return {
      contas,
      clearContas,
      createTipo,
      limpar,
      voltar,
      form,
      fetchImovel,
      fetchCategoria,
      fetchSubCategoria,
      fetchPagamento,
      handleCategoriaSelectClick,
      formattedDateEnd,
      handleDateChangeStartInsure,
      menuOpenEnd,
      selectedImovelId,
      selectedCategoriaId,
      selectedSubCategoriaId,
      selectedTipoPagamentoId,
      imoveisDisponiveis,
      categoriasDisponiveis,
      subCategoriasDisponiveis,
      tiposPagamentosDisponiveis,
      validaImovel,
      validaCategoria,
      validaSubCategoria,
      validaTipoPagamento,
      selectedLocatarioId,
      selectedLocadorId,
      locatariosDisponiveis,
      locadoresDisponiveis,
      selectedClientId,
      validaCliente,
      snackbar,
      showSnackBar
    };
  },
};
</script>
