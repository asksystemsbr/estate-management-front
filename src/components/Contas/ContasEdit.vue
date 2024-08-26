<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Editar Conta - {{ titulo }}</h1>
        <v-form @submit.prevent="updateTipo" ref="form">
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
          <v-row  v-if="titulo ==='PAGAR'" align="center" justify="center">        
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
          <v-row v-if="titulo ==='RECEBER'" align="center" justify="center">        
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
          <template v-slot:activator="{  attrs }">
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
            @update:modelValue ="handleDateChangeStartInsure"
            no-title
          ></v-date-picker>
      </v-menu>
      <v-btn
              color="primary"
              class="mr-4"
              type="submit"
            >
              Salvar
        </v-btn>            
        </v-form>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="12">
        <br/>
        <hr />
        <h2>Histórico de Pagamentos</h2>        
        <hr />
        <br/>
        <v-text-field
          v-model="contasHistorico.valor"
          label="Valor"
          @blur="formatValor"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-menu
          ref="menu"
          v-model="menuOpenPaymentDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{  attrs }">
            <v-text-field
              v-model="formattedPaymentDate"
              label="Data de Pagamento"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              @click="menuOpenPaymentDate = true"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="contasHistorico.dtPgto"
            @input="handleDateChangePayment"
            @update:modelValue="handleDateChangePayment"
            no-title
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          @click="saveHistorico"
        >
          Adicionar Pagamento
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="historicoHeaders"
          :items="historicoData"
          item-key="id"
          class="elevation-1"
        >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ formatCurrency(item.valor) }}</td>
            <td class="text-left">{{ formatDate(item.dtPgto) }}</td>
            <td class="text-center">
              <v-btn color="red" icon @click.stop="confirmDelete(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-right">
        <h3>Total Pago: {{ formatCurrency(totalPago) }}</h3>
      </v-col>
    </v-row>    
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="secondary" @click="closeModal">Fechar</v-btn>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmação para exclusão -->
    <v-dialog v-model="showDeleteConfirm" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirmação</v-card-title>
          <v-card-text>Tem certeza de que deseja excluir esta conta?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelDelete">Cancelar</v-btn>
            <v-btn color="red darken-1" text @click="deleteCurrent(currentDeleteId)">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showConfirm" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirmação</v-card-title>
          <v-card-text>{{ messageConfirm }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="confirmMessage">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>
  
  <script>
  import { ref, onMounted,computed,nextTick,watch  } from 'vue';
  import axios from 'axios';
  import {contas,clearContas} from '@/model/contas.js';
  
  export default {
    props: {
        tipoId: {
            type: Number,
            required: true
        },
        titulo: {
            type: String,
            required: true
        }
    },
  setup(props, { emit }) {
      const form = ref(null);
      const menuOpenEnd  = ref(false);
      const menuOpenPaymentDate = ref(false);
      const selectedImovelId  = ref(0);
      const selectedLocatarioId = ref(0);
      const selectedLocadorId = ref(0);
      const selectedCategoriaId  = ref(0);
      const selectedSubCategoriaId  = ref(0);
      const selectedTipoPagamentoId  = ref(0);
      const imoveisDisponiveis=ref([]);
      const locatariosDisponiveis = ref([]);
      const locadoresDisponiveis = ref([]);
      const categoriasDisponiveis=ref([]);
      const subCategoriasDisponiveis=ref([]);
      const tiposPagamentosDisponiveis=ref([]);
      const validaImovel  = ref(false);
      const validaCliente = ref(false);
      const validaCategoria  = ref(false);
      const validaSubCategoria  = ref(false);
      const validaTipoPagamento  = ref(false);
      const showDeleteConfirm= ref(false);
      const showConfirm= ref(false);
      const currentDeleteId = ref(null);
      const messageConfirm = ref('');
      const contasHistorico = ref({
        id: 0,
        Conta: '',
        valor: '',
        Tipo:props.titulo,        
        dtPgto: null,
        IdConta: props.tipoId
      });
      const historicoData = ref([]);
      const historicoHeaders = ref([
      { title: 'Código', value: 'id', sortable: true },
      { title: 'Valor', value: 'valor', sortable: true },
      { title: 'Data de Pagamento', value: 'dtPgto', sortable: true },            
      { title: 'Deletar', value: 'delete', sortable: false }
    ]);

    
    const fetchContas = async () => {
      try {
        // await fetchSituacaoCliente();
        // console.log('Situações Cliente:', situacoesCliente.value);
        const response = await axios.get(`/api/conta/${props.tipoId}`);
        console.log('Dados Recebidos:', response.data);
        contas.value = response.data;

            // Transforme strings de data em objetos Date
        contas.value.dtVencimento = contas.value.dtVencimento ? new Date(contas.value.dtVencimento) : null;
        await nextTick(); // Aguarda a atualização do DOM
        selectedImovelId.value = contas.value.imovelId;
        selectedCategoriaId.value = contas.value.categoriaId;

        fetchSubCategoria();
        selectedSubCategoriaId.value = contas.value.subCategoriaId;
        selectedTipoPagamentoId.value = contas.value.formaPagamentoId;

        contas.value.imovelId = response.data.imovelId;
        contas.value.categoriaId = response.data.categoriaId;
        contas.value.subCategoriaId = response.data.subCategoriaId;
        contas.value.formaPagamentoId = response.data.formaPagamentoId;
        contas.value.ClienteId = response.data.clienteId;

        // Preencher o cliente selecionado
        if (props.titulo === 'PAGAR') {
          selectedLocatarioId.value = contas.value.ClienteId;
        } else if (props.titulo === 'RECEBER') {
          selectedLocadorId.value = contas.value.ClienteId;
        }
        //console.log('ID Situação Cliente:', response.data.iD_SITUACAO_CLIENTE);
      } catch (error) {
        emit('error', error); 
      }
    };

      const  fetchImovel = async () => {
          try {
            const response = await axios.get(`/api/Imovels`);
            imoveisDisponiveis.value = response.data.map(imovel => ({
            id: imovel.id,
            codigoImovel: imovel.codigoImovel
        }));        
          } catch (error) {
            emit('error', error);
          }
        };
      const  fetchCategoria = async () => {
          try {
                const response = await axios.get(`/api/ContaCategoria`);
                categoriasDisponiveis.value = response.data.map(categoria => ({
                id: categoria.id,
                descricao: categoria.descricao
              }));              
          } catch (error) {
              emit('error', error);
          }
        };
      const  fetchSubCategoria = async () => {
          try {
            const response = await axios.get(`/api/ContaSubCategoria/getcontassubcategoriascategoria/${selectedCategoriaId.value}`);
            subCategoriasDisponiveis.value = response.data.map(subCategoria => ({
            id: subCategoria.id,
            descricao: subCategoria.descricao
            }));            
          } catch (error) {
            emit('error', error);
          }
        };
      const  fetchPagamento = async () => {
          try {
            const response = await axios.get(`/api/TipoPagamento`);
            tiposPagamentosDisponiveis.value = response.data.map(tipoPagamento => ({
            id: tipoPagamento.id,
            descricao: tipoPagamento.descricao
            }));            
          } catch (error) {
            emit('error', error);
          }
        };

      const fetchHistorico = async () => {
        try {
          const response = await axios.get(`/api/ContasHistorico/getitembyconta/${props.tipoId}`);
          historicoData.value = response.data;
        } catch (error) {
          emit('error', error);
        }
      };

      const updateTipo = async () => {
        try {
          if (!contas.value || !contas.value.id) {         
            emit('error', {error:'Registro inválido'}); 
          return;
        }
            await axios.put(`/api/Conta/${props.tipoId}`, contas.value);
            clearContas();
            emit('update'); // Emitir evento para fechar a modal            
        } catch (error) {
          console.error('Erro ao atualizar registro:', error);
          emit('error', error); 
        }
      };    
  
      const saveHistorico = async () => {
        try {
          if (!contasHistorico.value.valor || !contasHistorico.value.dtPgto) {
            showMessage('Preencha todos os campos do pagamento.');
            return;
          }
          const valorPago = parseFloat(contasHistorico.value.valor.replace(',', '.'));

          const totalPagoAtual = parseFloat(totalPago.value.replace(',', '.')) + valorPago;
          if (totalPagoAtual > contas.value.valor) {
            showMessage('O valor pago já ultrapassou o valor devido');
          }

          // var valorPago = 0;
          // if (typeof contasHistorico.value.valor === 'number') {
          //   valorPago = contasHistorico.value.valor;
          // } else if (typeof contasHistorico.value.valor === 'string') {
             const valor = parseFloat(contasHistorico.value.valor.replace(',', '.')).toFixed(2);
             contasHistorico.value.valor = valor.replace(',', '.');
          //   valorPago = contasHistorico.value.valor;
          // }

          // const totalPagoAtual = totalPago.value + valorPago;
          // if (totalPagoAtual > parseFloat(contas.value.valor)) {
          //   alert('O valor pago já ultrapassou o valor devido');
          //   return;
          // }
          contasHistorico.value.IdConta = props.tipoId;
          contasHistorico.value.Conta = contas.value.contaNome;
          const response = await axios.post('/api/ContasHistorico', contasHistorico.value);
          historicoData.value.push(response.data);          
          contasHistorico.value.valor = '';
          contasHistorico.value.dtPgto = null;
        } catch (error) {
          emit('error', error);
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
        if (props.titulo === 'PAGAR') {
          await fetchLocatarios();
        } else if (props.titulo === 'RECEBER') {
          await fetchLocadores();
        }
      });

      watch([selectedLocatarioId, selectedLocadorId], () => {
        if (props.titulo === 'PAGAR') {
          contas.value.ClienteId = selectedLocatarioId.value;
        } else if (props.titulo === 'RECEBER') {
          contas.value.ClienteId = selectedLocadorId.value;
        }
      });

      const confirmDelete = async (id) => {
        try {
          currentDeleteId.value = id;
          showDeleteConfirm.value = true;         
        } catch (error) {
          emit('error', error);
        }
      };
      //   return { updateTipo, voltar, form };
      const closeModal = () => {
        emit('close'); // Emitir evento para fechar a modal
      };

      const cancelDelete =() => {
        currentDeleteId.value = null;
        showDeleteConfirm.value = false;
      };

      const deleteCurrent= async (id) => {
        try {
          await axios.delete(`/api/ContasHistorico/${id}`);
          historicoData.value = historicoData.value.filter(item => item.id !== id);
          cancelDelete(); // Fecha o diálogo de confirmação após a exclusão
        } catch (error) {
          cancelDelete();
          emit('error', error);
        }
      };

      const handleCategoriaSelectClick =() => {
        this.fetchSubCategoria();
      };

      const formattedDateEnd = computed(() => {
        return contas.value.dtVencimento
        ? new Date(contas.value.dtVencimento).toLocaleDateString('pt-BR')
        : '';
      });

      const handleDateChangeStartInsure = (value) => {
        contas.value.dtVencimento = value ? new Date(value) : null;
        menuOpenEnd.value = false; 
      };

      const formattedPaymentDate = computed(() => {
        return contasHistorico.value.dtPgto
        ? new Date(contasHistorico.value.dtPgto).toLocaleDateString('pt-BR')
        : '';
      });

      const handleDateChangePayment = (value) => {
        contasHistorico.value.dtPgto = value ? new Date(value) : null;
        menuOpenPaymentDate.value = false;
      };

      const totalPago = computed(() => {
        return historicoData.value.reduce((sum, item) => sum + parseFloat(item.valor), 0).toFixed(2);
      });

      const formatValor = () => {
        if (typeof contasHistorico.value.valor === 'number') {
          contasHistorico.value.valor = contasHistorico.value.valor.toFixed(2).replace('.', ',');
        } else if (typeof contasHistorico.value.valor === 'string') {
          const valor = parseFloat(contasHistorico.value.valor.replace(',', '.')).toFixed(2);
          contasHistorico.value.valor = valor.replace('.', ',');
        }
      };

      const formatCurrency = (value) => {
        if (typeof value !== 'string') {
          value = value.toString();
        }
        return parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      };

      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
      };

      const showMessage = (message) => {
        messageConfirm.value = message;
        showConfirm.value = true;
      };

      const confirmMessage = () => {
        showConfirm.value = false;
      };
        
      onMounted(() => {
      fetchImovel();
      fetchCategoria();      
      fetchPagamento();
      fetchContas();
      fetchHistorico();
    });

    return {
        contas,
        clearContas,
        updateTipo,
        closeModal,
        form,
        fetchImovel,
        fetchCategoria,
        fetchSubCategoria,
        fetchPagamento,
        fetchContas,
        handleCategoriaSelectClick,
        formattedDateEnd,
        handleDateChangeStartInsure,
        menuOpenEnd,
        menuOpenPaymentDate,
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
        contasHistorico,
        historicoData,
        historicoHeaders,
        saveHistorico,
        confirmDelete,
        formattedPaymentDate,
        handleDateChangePayment,
        totalPago,
        formatValor,
        formatCurrency,
        formatDate,
        showDeleteConfirm,
        currentDeleteId,
        cancelDelete,
        deleteCurrent,
        showConfirm,
        messageConfirm,
        confirmMessage,
        showMessage,
        locatariosDisponiveis,
        locadoresDisponiveis,
        selectedLocatarioId,
        selectedLocadorId,
        validaCliente,
    };
    }
  };
  </script>