<template>
    <v-container>
    <!-- Row para título e botão -->
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h1>Categorias de Contas</h1>
      </v-col>
      <v-col cols="auto">
          <v-btn color="primary" @click.stop="AddNew()">Nova Categoria de Conta</v-btn>
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
        :items="tipos"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.descricao }}</td>
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
            <conta-categoria-edit
            :tipo-id="selectedTipo"
            @update="handleUpdate"
            @error="handleError"
            @close="showEditModal = false"
            />
        </v-card>
    </v-dialog>

    <!-- Modal para incluir -->
        <v-dialog v-model="showAddModal" max-width="800">
        <v-card>
            <conta-categoria-create
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
          <v-card-text>Tem certeza de que deseja excluir esta categoria?</v-card-text>
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
  import ContaCategoriaEdit from './ContasCategoriasEdit.vue';
  import ContaCategoriaCreate from './ContasCategoriasCreate.vue';
  import errorHandling from '@/utilities/errorHandling';

  export default {
    components: {
    ContaCategoriaEdit,
    ContaCategoriaCreate,
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
      this.fetch();
    },
    methods: {
      async fetch() {
        try {
          const response = await axios.get('/api/ContaCategoria');
          this.tipos = response.data;
        } catch (error) {
          this.handleGlobalError(error, 'Failed to fetch register.');
        }
      },
      async deleteCurrent(id) {
        try {
          // await axios.delete(`${apiUrl}/api/TipoPagamento/${id}`);
          await axios.delete(`/api/ContaCategoria/${id}`);
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