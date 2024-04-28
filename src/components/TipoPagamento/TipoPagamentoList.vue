<template>
    <v-container>
    <!-- Row para título e botão -->
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h1>Tipos de Pagamentos</h1>
      </v-col>
      <v-col cols="auto">
          <v-btn color="primary" @click.stop="AddTipo()">Novo Tipo de Pagamento</v-btn>
      </v-col>
    </v-row>
    <br><br> <!-- Adicionando duas linhas em branco -->
      <!-- Filtro de busca -->
      <v-text-field
        v-model="search"
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
      ></v-text-field>

        <br> <!-- Adicionando duas linhas em branco -->
      <!-- Tabela de Tipos de Pagamentos -->
      <v-data-table
        :items="tipos"
        :headers="headers"
        :search="search"
        item-key="codigo"
        class="elevation-1"
      >
        
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.codigo }}</td>
            <td class="text-left">{{ item.descricao }}</td>
            <td class="text-center">
              <v-btn color="blue" icon @click.stop="editTipo(item.id)">
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
  
    <!-- Modal para editar Tipo de Pagamento -->
    <v-dialog v-model="showEditModal" max-width="600">
        <v-card>
            <tipo-pagamento-edit
            :tipo-id="selectedTipo"
            @update="handleTipoUpdate"
            @error="handleError"
            @close="showEditModal = false"
            />
        </v-card>
    </v-dialog>

    <!-- Modal para incluir Tipo de Pagamento -->
        <v-dialog v-model="showAddModal" max-width="800">
        <v-card>
            <tipo-pagamento-create
            @update="handleTipoUpdate"
            @error="handleError"
            @close="showAddModal = false"
            />
        </v-card>
    </v-dialog>
  
      <!-- Diálogo de confirmação para exclusão -->
      <v-dialog v-model="showDeleteConfirm" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirmação</v-card-title>
          <v-card-text>Tem certeza de que deseja excluir este tipo de pagamento?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelDelete">Cancelar</v-btn>
            <v-btn color="red darken-1" text @click="deleteTipo(currentDeleteId)">Excluir</v-btn>
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
  //import apiUrl from '@/config'; // Importar o URL base
  import TipoPagamentoEdit from './TipoPagamentoEdit.vue';
  import TipoPagamentoCreate from './TipoPagamentoCreate.vue';
  import errorHandling from '@/utilities/errorHandling';

  export default {
    components: {
    TipoPagamentoEdit,
    TipoPagamentoCreate,
  },
  mixins: [errorHandling],
    data() {
      return {
        tipos: [],
        headers: [
          { title: 'Código', value: 'codigo', sortable: true },
          { title: 'Descrição', value: 'descricao', sortable: true },
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
      this.fetchTipos();
    },
    methods: {
      async fetchTipos() {
        try {
          const response = await axios.get('/api/TipoPagamento');
          this.tipos = response.data;
        } catch (error) {
          this.handleGlobalError(error, 'Failed to fetch register.');
        }
      },
      async deleteTipo(id) {
        try {
          // await axios.delete(`${apiUrl}/api/TipoPagamento/${id}`);
          await axios.delete(`/api/TipoPagamento/${id}`);
          this.showSnackBar(`Registro excluído com sucesso`,'success');   
          this.fetchTipos(); // Atualiza a lista após a exclusão
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
        editTipo(tipo) {
            this.selectedTipo = tipo; // Criar uma cópia do objeto para evitar referência direta
            this.showEditModal = true;
        },
        // Método para atualizar a lista após edição
        handleTipoUpdate() {
            this.showEditModal = false;
            this.showAddModal = false;
            this.showSnackBar(`Registro Salvo com Sucesso`,'success');
            this.fetchTipos();
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
          this.fetchTipos();
        },
        AddTipo() {
            this.showAddModal = true;
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