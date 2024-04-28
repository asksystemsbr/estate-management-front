<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <h1>Grupo usuários</h1>
        </v-col>
      </v-row>
        <v-row align="center" justify="center">        
          <v-col cols="12" md="6">
          <v-select
            v-model="selectedGrupoId"
            :items="gruposDisponiveis"
            label="Selecione um Grupo"
            item-title="descricao"
            item-value="id"  
            @update:model-value="handleGrupoSelectClick"     
            :error-messages="!validaGrupo ? '' : 'Selecione um grupo válido'"     
          ></v-select>
        </v-col>
      </v-row>
        <v-row align="center" justify="center">            
          <v-col cols="12" md="6">
          <v-select
            v-model="selectedUserId"
            :items="usuariosDisponiveis"
            label="Selecione um Usuário"
            item-title="nome"
            item-value="id"
            :error-messages="!validaUsuario ? '' : 'Selecione um usuário válido'"
          ></v-select>
        </v-col>
      </v-row>
        <v-row align="center" justify="center">            
        <v-col cols="auto">
          <v-btn color="primary" @click="adicionarUsuarioAoGrupo">Adicionar Usuário ao Grupo</v-btn>
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
  
      
      <v-data-table
        :items="usuarios"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.nome }}</td>
            <td class="text-center">
              <v-btn color="red" icon @click="confirmDelete(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- Confirmation dialog for deletion -->
      <v-dialog v-model="showDeleteConfirm" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirmação</v-card-title>
          <v-card-text>Tem certeza de que deseja excluir este grupo de usuário?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  @click="cancelDelete">Cancelar</v-btn>
            <v-btn color="red darken-1"  @click="deleteGrupo(currentDeleteId)">Excluir</v-btn>
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
import {usuario} from '@/model/usuario.js';
import errorHandling from '@/utilities/errorHandling';

export default {
  // components: {
  //   GroupEdit,
  //   GroupCreate
  // },
  mixins: [errorHandling],
  data() {
    return {
        usuarios: [],
      headers: [
        { title: 'Descricao', value: 'nome' , sortable: true },
        { title: 'Excluir', value: 'delete' , sortable: false  }
      ],
      search: '',
      showDeleteConfirm: false,
      currentDeleteId: null,      
      selectedGrupoId: '',
      selectedUserId: '',
      validaGrupo: false,
      validaUsuario: false,

      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },
      usuariosDisponiveis: [],
      gruposDisponiveis: []
    };
  },
  created() {
    this.fetchData('/api/GrupoUsuarios', 'gruposDisponiveis');
    this.fetchData('/api/Usuarios', 'usuariosDisponiveis');
  },
  methods: {
    async fetchData(url, dataProperty) {
      try {
        const response = await axios.get(url);
        if(dataProperty==='usuariosDisponiveis')
        {
          this[dataProperty] = response.data.map(item => ({
            id: item.id,
            nome: item.nome
          }));
        }
        else{
          this[dataProperty] = response.data.map(item => ({
            id: item.id,
            descricao: item.descricao
          }));
        }
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
  },  
  async fetch() {
      try {
        const response = await axios.get(`/api/Usuarios/getusuariogrupo/${this.selectedGrupoId}`);
        this.usuarios = response.data.map(usuario => ({
        id: usuario.id,
        nome: usuario.nome
    }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    async adicionarUsuarioAoGrupo() {
      try {
          this.validaGrupo = false;
          this.validaUsuario = false;
          if (!this.selectedGrupoId || this.selectedGrupoId === 0 || this.selectedGrupoId === '') {
            this.validaGrupo = true;
          }
          if (!this.selectedUserId || this.selectedUserId === 0 || this.selectedUserId === '') {
            this.validaUsuario = true;
          }

          if(this.validaGrupo || this.validaUsuario )
          {
            this.showSnackBar(`Verifique os campos necessários`,'error'); 
            return;
          }
          this.validaGrupo = false;
          this.validaUsuario = false;

        //obter o usuário 
        const responseUsuario = await axios.get(`/api/Usuarios/${this.selectedUserId}`);
            usuario.value = responseUsuario.data;

        //setar o grupo
        usuario.value.grupoUsuarioId=this.selectedGrupoId;
        //salvar o usuário
        const responseUsuarioUpdt = await axios.put(`/api/Usuarios/${usuario.value.id}`, usuario.value);
          

        if (responseUsuarioUpdt.status === 204) {
                this.selectedUserId = 0;
                this.fetch();
        }
      }
      catch (error) {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
  },
    async deleteGrupo(id) {
      try {        
        await axios.delete(`/api/usuarios/limpargrupo/${id}`);           
        this.showSnackBar(`Registro excluído com sucesso`,'success'); 
        this.fetch();
        this.cancelDelete();
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
      this.showDeleteConfirm = false;
      this.currentDeleteId = null;
    },
    handleUpdate() {
      this.showEditModal = false;
      this.showAddModal = false;
      this.showSnackBar(`Registro Salvo com Sucesso`,'success'); 
      this.fetch();
    },
    handleError(error) {
      if (typeof error === 'string') {
        this.showSnackBar(error,'error');
      }
      else
      {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
      this.fetch();
    },
    handleGrupoSelectClick() {
      this.fetch();
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
