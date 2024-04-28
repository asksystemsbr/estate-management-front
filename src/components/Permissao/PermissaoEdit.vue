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
            v-model="selectedPermissionId"
            :items="permissionDisponiveis"
            label="Selecione uma Permissão"
            item-title="descricao"
            item-value="id"
            :error-messages="!validaPermissao ? '' : 'Selecione uma permissão válido'"
          ></v-select>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">            
          <v-col cols="12" md="6">
          <v-select
            v-model="selectedModuleId"
            :items="modulesDisponibles"
            label="Selecione um Módulo"
            item-title="descricao"
            item-value="id"
            :error-messages="!validaModulo ? '' : 'Selecione um módulo válido'"
          ></v-select>
        </v-col>
      </v-row>      
        <v-row align="center" justify="center">            
            <v-col cols="12" md="6">
                <v-btn color="primary" @click="adicionarPermissao">Adicionar Permissão</v-btn>
            </v-col>
        </v-row>
        <v-row align="center" justify="center">              
            <v-col cols="12" md="6">
                <v-btn color="primary" @click="adicionarPermissaoAll">Adicionar permissão em todos módulos</v-btn>
            </v-col>
      </v-row>
      <v-row align="center" justify="center">   
      <v-col cols="12" md="6">
                <v-btn color="primary" @click="RemoverPermissaoAll">Remover permissão em todos módulos</v-btn>
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
        :items="modulos"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.modulo }}</td>
            <td class="text-left">{{ item.permissao }}</td>
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
          <v-card-text>Tem certeza de que deseja excluir essa permissão?</v-card-text>
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
import {permissao} from '@/model/permissao.js';
import errorHandling from '@/utilities/errorHandling';

export default {
  // components: {
  //   GroupEdit,
  //   GroupCreate
  // },
  mixins: [errorHandling],
  data() {
    return {
      modulos: [],
      headers: [
        { title: 'Módulo', value: 'modulo' , sortable: true },
        { title: 'Permissão', value: 'permissao' , sortable: true },
        { title: 'Excluir', value: 'delete' , sortable: false  }
      ],
      search: '',
      showDeleteConfirm: false,
      currentDeleteId: null,      
      selectedGrupoId: '',
      selectedModuleId: '',
      selectedPermissionId: '',
      validaGrupo: false,
      validaModulo: false,
      validaPermissao: '',
      
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },
      modulesDisponibles: [],
      gruposDisponiveis: [],
      permissionDisponiveis: [],
    };
  },
  created() {
    this.fetchData('/api/GrupoUsuarios', 'gruposDisponiveis');
    this.fetchData('/api/Modulo', 'modulesDisponibles');
    this.fetchData('/api/TipoPermissoes', 'permissionDisponiveis');
  },
  methods: {
    async fetchData(url, dataProperty) {
      try {
        const response = await axios.get(url);
        this[dataProperty] = response.data.map(item => ({
          id: item.id,
          descricao: item.descricao
        }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
  },  
  async fetch() {
      try {
        const response = await axios.get(`/api/permissoes/getpermissoesgrupo/${this.selectedGrupoId}`);
        //this.usuarios = response.data;
        this.modulos = response.data.map(modulo => ({
        id: modulo.id,
        modulo: modulo.modulo.descricao,
        permissao: modulo.tipoPermissao.descricao
    }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    async adicionarPermissao() {
      try {  
        this.validaPermissao = false;
          this.validaGrupo = false;
          this.validaModulo = false;
          if (!this.selectedGrupoId || this.selectedGrupoId === 0 || this.selectedGrupoId === '') {
            this.validaGrupo = true;
          }
          if (!this.selectedModuleId || this.selectedModuleId === 0 || this.selectedModuleId === '') {
            this.validaModulo = true;
          }
          if (!this.selectedPermissionId || this.selectedPermissionId === 0 || this.selectedPermissionId === '' ) {
            this.validaPermissao = true;
          }

          if(this.validaGrupo || this.validaModulo || this.validaPermissao)
          {
            this.showSnackBar(`Verifique os campos necessários`,'error'); 
            return;
          }

          this.validaPermissao = false;
          this.validaGrupo = false;
          this.validaModulo = false;
          //setar o grupo
          permissao.value.id=0;
          permissao.value.grupoUsuarioId=this.selectedGrupoId;
          permissao.value.moduloId=this.selectedModuleId;
          permissao.value.tipoPermissaoId=this.selectedPermissionId;
          //salvar o usuário
        const responseUsuarioUpdt = await axios.post(`/api/Permissoes`, permissao.value);
            

          if (responseUsuarioUpdt.status === 201) {
                  this.selectedModuleId = null;
                  this.selectedPermissionId = null;
                  this.showSnackBar(`Registro salvo com sucesso`,'success'); 
                  this.fetch();
          }
      }
      catch (error) {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
  },
  async adicionarPermissaoAll() {
      try {  
        this.validaPermissao = false;
          this.validaGrupo = false;
          this.validaModulo = false;
          if (!this.selectedGrupoId || this.selectedGrupoId === 0 || this.selectedGrupoId === '') {
            this.validaGrupo = true;
          }
          if (!this.selectedPermissionId || this.selectedPermissionId === 0 || this.selectedPermissionId === '' ) {
            this.validaPermissao = true;
          }

          if(this.validaGrupo || this.validaModulo || this.validaPermissao)
          {
            this.showSnackBar(`Verifique os campos necessários`,'error'); 
            return;
          }

          this.validaPermissao = false;
          this.validaGrupo = false;
          this.validaModulo = false;
          //setar o grupo
          permissao.value.id=0;
          permissao.value.grupoUsuarioId=this.selectedGrupoId;
          permissao.value.moduloId=null;
          permissao.value.tipoPermissaoId=this.selectedPermissionId;
          //salvar o usuário
        const responseUsuarioUpdt = await axios.post(`/api/Permissoes/savepermissionmodules`, permissao.value);
            

          if (responseUsuarioUpdt.status === 201) {
                  this.selectedModuleId = null;
                  this.selectedPermissionId = null;
                  this.showSnackBar(`Registro salvo com sucesso`,'success'); 
                  this.fetch();
          }
      }
      catch (error) {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
  },
  async RemoverPermissaoAll() {
      try {  
        this.validaPermissao = false;
          this.validaGrupo = false;
          this.validaModulo = false;
          if (!this.selectedGrupoId || this.selectedGrupoId === 0 || this.selectedGrupoId === '') {
            this.validaGrupo = true;
          }
          if (!this.selectedPermissionId || this.selectedPermissionId === 0 || this.selectedPermissionId === '' ) {
            this.validaPermissao = true;
          }

          if(this.validaGrupo || this.validaModulo || this.validaPermissao)
          {
            this.showSnackBar(`Verifique os campos necessários`,'error'); 
            return;
          }

          this.validaPermissao = false;
          this.validaGrupo = false;
          this.validaModulo = false;
          //setar o grupo
          permissao.value.id=0;
          permissao.value.grupoUsuarioId=this.selectedGrupoId;
          permissao.value.moduloId=null;
          permissao.value.tipoPermissaoId=this.selectedPermissionId;
          //salvar o usuário
        const responseUsuarioUpdt = await axios.post(`/api/Permissoes/deletepermissionmodules`, permissao.value);
            
        if (responseUsuarioUpdt.status === 201) {
            this.selectedModuleId = null;
            this.selectedPermissionId = null;
            this.showSnackBar(`Registro excluído com sucesso`,'success'); 
            this.fetch();
        }
      }
      catch (error) {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
  },
    async deleteGrupo(id) {
      try {        
        await axios.delete(`/api/Permissoes/${id}`);           
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