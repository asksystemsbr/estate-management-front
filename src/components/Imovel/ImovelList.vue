<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Imóveis</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="showAddModal = true">Novo Imóvel</v-btn>
        </v-col>
      </v-row>
      <br><br>
  
      <!-- Search filter -->
      <v-text-field
        v-model="search"
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
      ></v-text-field>
  
      <!-- Imovel data table -->
      <v-data-table
        :items="imoveis"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.codigoImovel }}</td>
            <td class="text-left">{{ item.cliente.nome }}</td>
            <td class="text-left">{{ item.locador.nome }}</td>
            <td class="text-left">{{ item.logradouro }}</td>
            <td class="text-left">{{ item.numero }}</td>
            <td class="text-left">{{ item.isFiador ? 'Sim' :'Não' }}</td>
            <td class="text-center">
              <v-btn color="blue" icon @click="editImovel(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn color="red" icon @click="confirmDelete(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
  
      <!-- Modals for Edit and Add -->
      <v-dialog v-model="showEditModal" max-width="700px">
        <v-card>
          <imovel-edit
            :id="selectedImovelId"
            @update="handleUpdate"
            @error="handleError"
            @close="showEditModal = false"
          />
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="showAddModal" max-width="700px">
        <v-card>
          <imovel-create
            @update="handleUpdate"
            @error="handleError"
            @close="showAddModal = false"
          />
        </v-card>
      </v-dialog>
  
      <!-- Confirmation dialog for deletion -->
      <v-dialog v-model="showDeleteConfirm" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirmação</v-card-title>
          <v-card-text>Tem certeza de que deseja excluir este imóvel?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  @click="cancelDelete">Cancelar</v-btn>
            <v-btn color="red darken-1"  @click="deleteImovel(currentDeleteId)">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for notifications -->
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
import axios from 'axios';
import ImovelEdit from './ImovelEdit.vue';
import ImovelCreate from './ImovelCreate.vue';
import errorHandling from '@/utilities/errorHandling';

export default {
  components: {
    ImovelEdit,
    ImovelCreate
  },
  mixins: [errorHandling],
  data() {
    return {
      imoveis: [],
      headers: [      
      { title: 'Cód Imóvel', value: 'codigoImovel' , sortable: true },  
      { title: 'Locatário', value: 'cliente.nome' , sortable: true },
        { title: 'Locador', value: 'locador.nome' , sortable: true },
        { title: 'Logradouro', value: 'logradouro' , sortable: true },
        { title: 'Número', value: 'numero' , sortable: true },
        { title: 'Fiador', value: 'isFiador' , sortable: true },
        { title: 'Editar', value: 'edit' , sortable: false },
        { title: 'Excluir', value: 'delete' , sortable: false  }
      ],
      search: '',
      showEditModal: false,
      showAddModal: false,
      showDeleteConfirm: false,
      currentDeleteId: null,      
      selectedImovelId: 0,
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },
    };
  },
  created() {
    this.fetchImoveis();
  },
  methods: {
    async fetchImoveis() {
      try {
        const response = await axios.get('/api/Imovels/getimoveisview');
        this.imoveis = response.data;
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    async deleteImovel(id) {
      try {        
        await axios.delete(`/api/Imovels/deleteimovelfiador/${id}`);   
        await axios.delete(`/api/Imovels/${id}`);                  
        this.showSnackBar(`Registro excluído com Sucesso`,'success');      
        this.fetchImoveis();
        this.cancelDelete();
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao excluir registro');
        this.cancelDelete();
      }
    },
    editImovel(id) {
      this.selectedImovelId = id;
      this.showEditModal = true;
    },
    confirmDelete(id,idUsuario) {
      this.currentDeleteId = id;
      this.currentDeleteUserId = idUsuario;
      this.showDeleteConfirm = true;
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.currentDeleteId = null;
      this.currentDeleteUserId = null;
    },
    handleUpdate() {
      this.showEditModal = false;
      this.showAddModal = false;

      this.showSnackBar(`Registro Salvo com Sucesso`,'success');

      this.fetchImoveis();
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
      this.fetchImoveis();
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
}
</script>
