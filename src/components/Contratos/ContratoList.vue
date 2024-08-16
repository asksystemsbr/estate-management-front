<template>
  <v-container>
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
          <td class="text-left">{{ item.locatario }}</td>
          <td class="text-left">{{ item.locador }}</td>
          <td class="text-left">{{ item.logradouro }}</td>
          <td class="text-left">{{ item.isFiador ? 'Sim' :'Não' }}</td>
          <td class="text-left">{{ item.dataVencimento }}</td>
        </tr>
      </template>
    </v-data-table>

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
import errorHandling from '@/utilities/errorHandling';

export default {
props: {
  days: {
    type: Number,
    required: false
  }
},
components: {
},
mixins: [errorHandling],
data() {
  return {
    imoveis: [],
    headers: [
    { title: 'Cód', value: 'codigoImovel' , sortable: true },  
    { title: 'Locatário', value: 'locatario' , sortable: true },
      { title: 'Locador', value: 'locador' , sortable: true },
      { title: 'Logradouro', value: 'logradouro' , sortable: true },
      { title: 'Fiador', value: 'isFiador' , sortable: true },
      { title: 'Vencimento', value: 'dataVencimento' , sortable: true },
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
    // Define a data inicial como o primeiro dia do mês atual
    dateStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    // O último dia do mês pode ser encontrado ao criar uma data do "primeiro dia" do próximo mês e subtrair um dia.
    dateEnd : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    selected: [],
  };
},
async created() {
  await this.fetchCliente();
  if (this.days) {
    await this.loadContratos();
  }
  else
  {    
    this.dateStart= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.dateEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    await this.fetchImoveis();
  }    
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
      // Construir o objeto de parâmetros com valores diretamente das variáveis reativas
      const params = {
        filterId: this.clienteId,
        StartDate: this.dateStart ? this.dateStart.toISOString().substring(0, 10) : null,
         EndDate: this.dateEnd ? this.dateEnd.toISOString().substring(0, 10) : null
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
 async loadContratos() {
    this.dateEnd = new Date();
    this.dateStart = new Date(this.dateEnd);
    this.dateStart.setDate(this.dateEnd.getDate()-this.days);
    // Lógica para carregar contratos com base em `days`
    console.log(`Carregando contratos para ${this.days} dias, com data inicial ${this.dateStart} e data final ${this.dateEnd}`);
    //await this.fetchImoveis();
    await  this.fetchImoveisFilter();
    // Adicione a lógica para buscar e exibir contratos aqui
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
  },
  handleDateChangeStart(value) {
          this.dateStart = value;
          this.menuOpenStart = false;  // Fecha o menu após selecionar a data
  },
  handleDateChangeEnd(value) {
          this.dateEnd = value;
          this.menuOpenEnd = false;  // Fecha o menu após selecionar a data
  },
  managerContract(codigo) {
      // Navega para a rota com o ID como parâmetro
      this.drawer = false;
      this.$router.push({ name: 'dashboard', params: { componentSelected: `ManagerContract-${codigo}` } });
    }
},
watch: {
  days: 'loadContratos'
},
mounted() {
  this.loadContratos();
}  
}
</script>
