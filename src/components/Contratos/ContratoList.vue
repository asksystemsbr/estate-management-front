<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Contratos</h1>
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
            label="Cliente"
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
        :items="imoveis"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.cliente.nome }}</td>
            <td class="text-left">{{ item.logradouro }}</td>
            <td class="text-left">{{ item.numero }}</td>
            <td class="text-left">{{ item.valor }}</td>
            <td class="text-left">{{ item.reajuste }}</td>
            <td class="text-left">{{ item.dataVencimento }}</td>
            <td class="text-center">
              <v-btn color="blue" icon @click="getContract(item.id)">
                <v-icon>mdi-file-word</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn color="green" icon @click="confirmDelete(item.id)">
                <v-icon>mdi-currency-usd</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <br><br>
        <!-- Row for title and button -->
        <v-row justify="center" >
        <v-col cols="auto"  align="center">
          <v-btn color="primary" @click="showAddModal = true">Reajustar Selecionados</v-btn>
        </v-col>
      </v-row>
 
      <!-- Modals for Edit and Add -->
      <v-dialog v-model="showEditModal" max-width="600px">
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
            <v-btn color="red darken-1"  @click="deleteClient(currentDeleteId)">Excluir</v-btn>
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
        { title: 'Proprietário', value: 'cliente.nome' , sortable: true },
        { title: 'Logradouro', value: 'logradouro' , sortable: true },
        { title: 'Número', value: 'numero' , sortable: true },
        { title: 'Valor', value: 'valor' , sortable: true },
        { title: 'Reajuste', value: 'reajuste' , sortable: true },
        { title: 'Vencimento', value: 'dataVencimento' , sortable: true },
        { title: 'Gerar', value: 'edit' , sortable: false },
        { title: 'Recibo', value: 'delete' , sortable: false  }
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
      clienteCadastrado:[],
      clienteId:null,
      menuOpenStart: false,
      menuOpenEnd: false,
      // Define a data inicial como o primeiro dia do mês atual
      dateStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      // O último dia do mês pode ser encontrado ao criar uma data do "primeiro dia" do próximo mês e subtrair um dia.
      dateEnd : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),

    };
  },
  async created() {
    await this.fetchImoveis();
    await this.fetchCliente();
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
    async deleteImovel(id) {
      try {        
        await axios.delete(`/api/Imovels/${id}`);         
        this.showSnackBar(`Registro excluído com Sucesso`,'success');      
        this.fetchImoveis();
        this.cancelDelete();
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao excluir registro');
        this.cancelDelete();
        this.cancelDelete();
      }
    },
    async getContract(id) {
      try {
            const response = await axios.get(`/api/Document/${id}`, {
              responseType: 'blob' // Importante para tratar a resposta como um Blob
            });

                // Extrair o nome do arquivo do cabeçalho de disposição de conteúdo
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'Documento.docx'; // Nome padrão se o cabeçalho não estiver presente
            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
              if (filenameMatch.length > 1) {
                filename = filenameMatch[1];
              }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Define o nome do arquivo
            document.body.appendChild(link);
            link.click();

      } catch (error) {
        this.handleGlobalError(error, 'Erro ao gerar documento');
      }
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
    }

  }
}
</script>
