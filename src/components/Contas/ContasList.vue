<template>
    <v-container>
    <!-- Row para título e botão -->
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h1>Contas - {{ titulo }}</h1>
      </v-col>
      <v-col cols="auto">
          <v-btn color="primary" @click.stop="AddNew()">Nova Conta</v-btn>
      </v-col>
    </v-row>
    <br><br> 
      <!-- Filtro de busca -->
      <v-text-field
        v-model="search"
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
      ></v-text-field>

        <br> 
      <v-data-table
        :items="contas"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.contaNome }}</td>
            <td class="text-left">{{ formatCurrency(item.valor) }}</td>
            <td class="text-left">{{ formatDate(item.dtVencimento) }}</td>
            <td class="text-center">
              <v-btn color="blue" icon @click.stop="edit(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn color="red" icon @click.stop="confirmDelete(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
  
    <!-- Modal para editar -->
    <v-dialog v-model="showEditModal" max-width="600">
        <v-card>
            <contas-edit
            :tipo-id="selectedTipo"
            :titulo="titulo"
            @update="handleUpdate"
            @error="handleError"
            @close="showEditModal = false"
            />
        </v-card>
    </v-dialog>

    <!-- Modal para incluir -->
        <v-dialog v-model="showAddModal" max-width="800">
        <v-card>
            <contas-create
            :titulo="titulo"
            @update="handleUpdate"
            @error="handleError"
            @close="showAddModal = false"
            />
        </v-card>
    </v-dialog>
  
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

        <!-- Snackbar for displaying login status -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="snackbar.timeout"
        >
          {{ snackbar.message }}
          <template v-slot:action>
            <v-btn text color="white" @click="snackbar.show = false">
              Fechar
            </v-btn>
          </template>
        </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import ContasEdit from './ContasEdit.vue';
  import ContasCreate from './ContasCreate.vue';
  import errorHandling from '@/utilities/errorHandling';

  export default {
    components: {
    ContasEdit,
    ContasCreate,
  },
  mixins: [errorHandling],
  props: {
    titulo: {
      type: String,
      required: true
    }
  },  
    data() {
      return {
        contas: [],
        headers: [
          { title: 'Código', value: 'codigo', sortable: true },
          { title: 'Descrição', value: 'contaNome', sortable: true },
          { title: 'Valor', value: 'valor', sortable: true },
          { title: 'Vencimento', value: 'dtVencimento', sortable: true },
          { title: 'Atualizar', value: 'edit', sortable: false },
          { title: 'Deletar', value: 'delete', sortable: false }
        ],
        showDeleteConfirm: false,
        currentDeleteId: null,
        search: '',
        selectedTipo: 0,
        showEditModal: false,
        showAddModal: false,
        snackbar: {
            show: false,
            message: '',
            color: '',
            timeout: 3000
        },
      };
    },
    created() {
      this.fetch();
    },
    methods: {
      async fetch() {
        try {
          const response = await axios.get(`/api/Conta/GetByType/${this.titulo}`);
          this.contas = response.data;
        } catch (error) {
          this.handleGlobalError(error, 'Failed to fetch register.');
        }
      },
      async deleteCurrent(id) {
        try {
          // await axios.delete(`${apiUrl}/api/TipoPagamento/${id}`);
          await axios.delete(`/api/Conta/${id}`);
          this.showSnackBar(`Registro excluído com sucesso`,'success');   
          this.fetch(); // Atualiza a lista após a exclusão
          this.cancelDelete(); // Fecha o diálogo de confirmação após a exclusão
        } catch (error) {
          this.handleGlobalError(error, 'Erro ao excluir registro');
          this.cancelDelete();
        }
      },
      confirmDelete(id) {
        this.currentDeleteId = id;
        this.showDeleteConfirm = true;
      },
      cancelDelete() {
        this.currentDeleteId = null;
        this.showDeleteConfirm = false;
      },
      // Método para abrir a modal de edição
        edit(tipo) {
            this.selectedTipo = tipo; // Criar uma cópia do objeto para evitar referência direta
            this.showEditModal = true;
        },
        // Método para atualizar a lista após edição
        handleUpdate() {
            this.showEditModal = false;
            this.showAddModal = false;
            this.showSnackBar(`Registro Salvo com Sucesso`,'success');
            this.fetch();
        },
    handleError(error) {
      this.showEditModal = false;
      this.showAddModal = false;

      if (typeof error === 'string') {
        this.showSnackBar(error,'error');
      }
      else
      {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
      this.fetch();
    },
    AddNew() {
        this.showAddModal = true;
    },
    formatCurrency (value) {
        if (typeof value !== 'string') {
          value = value.toString();
        }
        return parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      },
      formatDate (date) {
        return new Date(date).toLocaleDateString('pt-BR');
      },
    showSnackBar(message,color)
    {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    errorEvent(message,color) {
      this.showSnackBar(message,color);
    }
    }
  };
  </script>