<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Funcionários</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="showAddModal = true">Novo Funcionário</v-btn>
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
  
      <!-- Employee data table -->
      <v-data-table
        :items="funcionarios"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.nome }}</td>
            <td class="text-left">{{ item.email }}</td>
            <td class="text-left">{{ item.usuario.nome }}</td>
            <td class="text-center">
              <v-btn color="blue" icon @click="editFuncionario(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn color="red" icon @click="confirmDelete(item.id,item.usuario.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
  
      <!-- Modals for Edit and Add -->
      <v-dialog v-model="showEditModal" max-width="600px">
        <v-card>
          <employee-edit
            :id="selectedEmployeeId"
            @update="handleUpdate"
            @error="handleError"
            @close="showEditModal = false"
          />
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="showAddModal" max-width="700px">
        <v-card>
          <employee-create
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
          <v-card-text>Tem certeza de que deseja excluir este funcionário?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  @click="cancelDelete">Cancelar</v-btn>
            <v-btn color="red darken-1"  @click="deleteEmployee(currentDeleteId,currentDeleteUserId)">Excluir</v-btn>
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
import EmployeeEdit from './FuncionarioEdit.vue';
import EmployeeCreate from './FuncionarioCreate.vue';
import errorHandling from '@/utilities/errorHandling';

export default {
  components: {
    EmployeeEdit,
    EmployeeCreate
  },
  mixins: [errorHandling],
  data() {
    return {
      funcionarios: [],
      headers: [
        { title: 'Nome', value: 'nome' , sortable: true },
        { title: 'E-mail', value: 'email' , sortable: true },
        { title: 'Usuario', value: 'usuario.nome' , sortable: true },
        { title: 'Editar', value: 'edit' , sortable: false },
        { title: 'Excluir', value: 'delete' , sortable: false  }
      ],
      search: '',
      showEditModal: false,
      showAddModal: false,
      showDeleteConfirm: false,
      currentDeleteId: null,      
      currentDeleteUserId: null,
      selectedEmployeeId: 0,
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },
    };
  },
  created() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get('/api/Funcionarios');
        this.funcionarios = response.data;
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    async deleteEmployee(id,idUsuario) {
      try {        
        await axios.delete(`/api/Funcionarios/${id}`);      
        await axios.delete(`/api/usuarios/${idUsuario}`);    
        this.showSnackBar(`Registro excluído com Sucesso`,'success');      
        this.fetchEmployees();
        this.cancelDelete();
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao excluir registro');
        this.cancelDelete();
        this.cancelDelete();
      }
    },
    editFuncionario(id) {
      this.selectedEmployeeId = id;
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

      this.fetchEmployees();
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
      this.fetchEmployees();
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
