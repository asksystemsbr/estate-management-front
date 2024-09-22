<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Laudos</h1>
        </v-col>
      </v-row>

      <h4>Filtros</h4>
      <v-row align="center">
        <v-col cols="12" sm="12">
          <v-select
            v-model="clienteId"
            :items="clienteCadastrado"
            item-title="nome"
            item-value="id"
            label="Locatário"
            required
          ></v-select>
        </v-col>
      </v-row>

      <v-row align="center">
      <!-- Date picker for Start Date -->
      <v-col cols="6" sm="6">
      <v-menu
            ref="menu"
            v-model="menuOpenStart"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
        >
            <template v-slot:activator="{  attrs }">
              <v-text-field
                v-model="formattedDateStart"
                label="Data Inicial"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                @click="menuOpenStart = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateStart"
              @input="handleDateChangeStart"
              @update:modelValue ="handleDateChangeStart"
              no-title
            ></v-date-picker>
        </v-menu>
      </v-col>
       <!-- Date picker for End Date -->
       <v-col cols="6" sm="6">
        <v-menu
          ref="menuEnd"
          v-model="menuOpenEnd"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{  attrs }">
            <v-text-field
              v-model="formattedDateEnd"
              label="Data Final"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              @click="menuOpenEnd = true"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateEnd"
            @input="handleDateChangeEnd"
            @update:modelValue ="handleDateChangeEnd"
            no-title
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

        <!-- Search filter -->
      <v-row justify="center">
        <v-col cols="6" sm="6"  align="right"> 
          <v-btn color="red" @click="ClearFilters">Limpar Filtros</v-btn>
      </v-col>
        <v-col cols="6" sm="6"  align="left"> 
          <v-btn color="success" @click="applyFilters">Aplicar Filtros</v-btn>
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
        v-model="selected"
        :items="imoveis"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
        item-value="id"
        return-object
      >

        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.codigoImovel }}</td>
            <!-- <td class="text-left">{{ item.cliente.nome }}</td> -->
            <!-- <td class="text-left">{{ item.locador.nome }}</td> -->
            <td class="text-left">{{ item.logradouro }}</td>
            <td class="text-left">{{ item.valor }}</td>
            <td class="text-left">{{ item.isFiador ? 'Sim' :'Não' }}</td>
            <td class="text-left">{{ item.dataVencimento }}</td>
            <td class="text-center">
              <v-btn color="green" icon @click="openLaudoStart(item.id)">
                <v-icon>mdi-home-analytics</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn color="red" icon @click="openLaudoEnd(item.id)">
                <v-icon>mdi-home-analytics</v-icon>
              </v-btn>
            </td>         
          </tr>
        </template>
      </v-data-table>
      <br><br>
  
        <!-- Modals for Edit and Add -->
        <v-dialog v-model="showLaudoStartModal" max-width="700px">
        <v-card>
          <laudos-edit
            :id="selectedImovelId"
            :start="true"
            @update="handleUpdate"
            @error="handleError"
            @close="showLaudoStartModal = false"
          />
        </v-card>
      </v-dialog>

        <!-- Modals for Edit and Add -->
        <v-dialog v-model="showLaudoEndModal" max-width="700px">
        <v-card>
          <laudos-edit
            :id="selectedImovelId"
            :start="false"
            @update="handleUpdate"
            @error="handleError"
            @close="showLaudoEndModal = false"
          />
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
import LaudosEdit from './LaudosPictures.vue';
import errorHandling from '@/utilities/errorHandling';
import { imovel, clearImovel } from '@/model/imovel.js';

export default {
  props: {
  },
  components: {
    LaudosEdit
  },
  mixins: [errorHandling],
  data() {
    return {
      imoveis: [],
      headers: [
      { title: 'Cód', value: 'codigoImovel' , sortable: true },  
      //{ title: 'Locatário', value: 'cliente.nome' , sortable: true },
        //{ title: 'Locador', value: 'locador.nome' , sortable: true },
        { title: 'Logradouro', value: 'logradouro' , sortable: true },
        { title: 'Valor', value: 'valor' , sortable: true },
        { title: 'Fiador', value: 'isFiador' , sortable: true },
        { title: 'Vencimento', value: 'dataVencimento' , sortable: true },
        { title: 'Início', value: 'edit' , sortable: false },
        { title: 'Fim', value: 'delete' , sortable: false  },
      ],
      search: '',
      currentDeleteId: null,      
      selectedImovelId: 0,
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },
      clienteCadastrado:[],
      clienteId:null,
      menuOpenStart: false,
      menuOpenEnd: false,
      // Define a data inicial como o primeiro dia do mês atual
      dateStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      // O último dia do mês pode ser encontrado ao criar uma data do "primeiro dia" do próximo mês e subtrair um dia.
      dateEnd : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      adjustValue: 0,
      showAdjustModal: false,
      showLaudoStartModal: false,
      showLaudoEndModal: false,
      valid: false,
      selected: [],
      selectAll: false,
    };
  },
  async created() {
    await this.fetchCliente(); 
      this.dateStart= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      this.dateEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      await this.fetchImoveisFilter();
  },
  computed: {
     formattedDateStart (){
         return new Date(this.dateStart).toLocaleDateString('pt-BR');
        },
        formattedDateEnd (){
         return new Date(this.dateEnd).toLocaleDateString('pt-BR');
        }
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
    async fetchImoveisFilter() {
      try {
        // console.log('data inicio',this.dateStart);        
        // console.log('data inicio editada',this.dateStart.toISOString().substring(0, 10));
        
        // console.log('data fim',this.dateEnd);
        // console.log('data fim editada',this.dateEnd.toISOString().substring(0, 10));
        // Construir o objeto de parâmetros com valores diretamente das variáveis reativas
        const params = {
          filterId: this.clienteId,
          StartDate: this.dateStart ? this.dateStart.toISOString().substring(0, 10) : null,
           EndDate: this.dateEnd ? this.dateEnd.toISOString().substring(0, 10) : null,
           filterCod: '',
        };
        
        const response = await axios.get(`/api/Imovels/getimoveisbyclientview`,{params});
        this.imoveis = response.data;
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },    
    async fetchCliente  () {
      try {
            const response = await axios.get(`/api/Cliente`);
            this.clienteCadastrado = response.data.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome
        }));

      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    handleUpdate() {
      this.showLaudoStartModal = false;
      this.showLaudoEndModal = false;

      this.showSnackBar(`Registro Salvo com Sucesso`,'success');

      this.fetchImoveis();
    },
    handleError(error) {
      this.showLaudoStartModal = false;
      this.showLaudoEndModal = false;

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
    },
    handleDateChangeStart(value) {
            this.dateStart = value;
            this.menuOpenStart = false;  // Fecha o menu após selecionar a data
    },
    handleDateChangeEnd(value) {
            this.dateEnd = value;
            this.menuOpenEnd = false;  // Fecha o menu após selecionar a data
    },
    ClearFilters() {
      this.clienteId= null;
      // Define a data inicial como o primeiro dia do mês atual
      this.dateStart= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      // O último dia do mês pode ser encontrado ao criar uma data do "primeiro dia" do próximo mês e subtrair um dia.
      this.dateEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      this.fetchImoveis();
    },
    applyFilters() {
        this.fetchImoveisFilter();
    },
    async confirmAdjustment() {
      if (this.$refs.adjustForm.validate()) {
        try {
          console.log(this.selected);
          const selectedIds = this.selected.map(item => item.id);          
          console.log(selectedIds);
          for (const id of selectedIds) {
            try {
              const response = await axios.get(`/api/Imovels/${id}`);
                console.log('Dados do imovel Recebidos:', response.data);
                imovel.value = response.data;
                //updateRejuste
                imovel.value.reajuste = this.adjustValue;
                await axios.put(`/api/Imovels/PutReajuste/${imovel.value.id}`, imovel.value);
                console.log(`Reajuste aplicado para o ID: ${id}`);
                } catch (error) {
                  this.handleGlobalError(error, `Erro ao reajustar o ID: ${id}`);
                }
            }

          
          this.showAdjustModal = false;
          this.showSnackBar(`Reajuste de ${this.adjustValue}% aplicado aos IDs: ${selectedIds.join(', ')}`, 'success');
          // Fetch updated data if necessary
          this.fetchImoveis();
          clearImovel();
          this.selectedImovelId = 0;
          this.adjustValue = 0;
        } catch (error) {
          this.handleGlobalError(error, 'Erro ao aplicar reajuste');
        }
      }
    },
    openLaudoStart(id) {
      this.selectedImovelId = id;
      this.showLaudoStartModal = true;
    },
    openLaudoEnd(id) {
      this.selectedImovelId = id;
      this.showLaudoEndModal = true;
    },
  },
  watch: {
    selected(newValue, oldValue) {
      console.log(`Message changed from "${oldValue}" to "${newValue}"`);
      console.log(this.selected);
    }
  },
  mounted() {
    //this.loadContratos();
  }  
}
</script>
