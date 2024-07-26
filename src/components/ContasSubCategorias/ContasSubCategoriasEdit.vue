<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <h1>Adicionar Sub Categorias</h1>
        </v-col>
      </v-row>
        <v-row align="center" justify="center">        
          <v-col cols="12" md="6">
          <v-select
            v-model="selectedCategoriaId"
            :items="categoriasDisponiveis"
            label="Selecione uma Categoria"
            item-title="descricao"
            item-value="id"  
            @update:model-value="handleGrupoSelectClick"     
            :error-messages="!validaGrupo ? '' : 'Selecione uma categoria válida'"     
          ></v-select>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">        
          <v-col cols="12" md="6">
            <v-text-field
            v-model="descricao"
            label="Descrição Sub Categoria"
            required
            :rules="[v => !!v || 'Campo obrigatório']"
          ></v-text-field>
        </v-col>
      </v-row>
        <v-row align="center" justify="center">            
        <v-col cols="auto">
          <v-btn color="primary" @click="adicionarCategoriaSubCategoria">Adicionar Sub Categoria</v-btn>
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
        :items="contaSubCategoria"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.descricao }}</td>
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
          <v-card-text>Tem certeza de que deseja excluir esta sub categoria?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  @click="cancelDelete">Cancelar</v-btn>
            <v-btn color="red darken-1"  @click="deleteCurrent(currentDeleteId)">Excluir</v-btn>
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
import {contaSubCategorias,clearContaSubCategorias} from '@/model/contaSubCategorias.js';
import errorHandling from '@/utilities/errorHandling';

export default {
  mixins: [errorHandling],
  data() {
    return {
      contaSubCategoria: [],
      contaSubCategorias,
      headers: [
        { title: 'Descricao', value: 'descricao' , sortable: true },
        { title: 'Excluir', value: 'delete' , sortable: false  }
      ],
      search: '',
      showDeleteConfirm: false,
      currentDeleteId: null,      
      selectedCategoriaId: 0,
      validaGrupo: false,
      validaSubCategoria: false,
      descricao: '',

      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },
      categoriasDisponiveis: []
    };
  },
  created() {
    clearContaSubCategorias();
    this.fetchData('/api/ContaCategoria', 'categoriasDisponiveis');    
  },
  methods: {
    async fetchData(url, dataProperty) {
      try {
        const response = await axios.get(url);
        if(dataProperty==='categoriasDisponiveis')
        {
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
        const response = await axios.get(`/api/ContaSubCategoria/getcontassubcategoriascategoria/${this.selectedCategoriaId}`);
        this.contaSubCategoria = response.data.map(subCategoria => ({
        id: subCategoria.id,
        descricao: subCategoria.descricao
    }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    async adicionarCategoriaSubCategoria() {
      try {
          this.validaGrupo = false;
          this.validaSubCategoria = false;
          if (!this.selectedCategoriaId || this.selectedCategoriaId === 0 || this.selectedCategoriaId === '') {
            this.validaGrupo = true;
          }
          if (!this.descricao ||  this.descricao === '') {
            this.validaSubCategoria = true;
          }

          if(this.validaGrupo || this.validaSubCategoria )
          {
            this.showSnackBar(`Verifique os campos necessários`,'error'); 
            return;
          }
          this.validaGrupo = false;
            this.validaSubCategoria = false;

          contaSubCategorias.value.contasCategoriasId=this.selectedCategoriaId;
          contaSubCategorias.value.descricao = this.descricao;

       
        //salvar a subcategoria
        const responseNew = await axios.post(`/api/ContaSubCategoria/`,contaSubCategorias.value);
                
        if (responseNew.status === 201 ) {
                //this.selectedCategoriaId = 0;
                this.descricao='';
                clearContaSubCategorias();
                this.fetch();
        }
      }
      catch (error) {
        this.handleGlobalError(error, 'Erro ao salvar registro');
      }
  },
    async deleteCurrent(id) {
      try {        
        const response = await axios.get(`/api/Conta/hasSubCategories/${id}`);
          if (response.data) {
            this.showSnackBar(`Essa Sub categoria já está em uso!`, 'error');
            this.cancelDelete();
            return;
          }

        await axios.delete(`/api/ContaSubCategoria/${id}`);   
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
