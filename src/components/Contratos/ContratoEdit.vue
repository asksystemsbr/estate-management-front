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
                label="Data Inicial Reajuste"
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
              label="Data Final Reajuste"
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
        show-select
      >

        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td>
            <v-checkbox
              v-model="selected"
              :value="item"
              hide-details
              @click.stop="toggleItemSelection(item)"
            ></v-checkbox>
          </td>
            <td class="text-left">{{ item.codigoImovel }}</td>
            <td class="text-left">{{ item.locatario }}</td>
            <td class="text-left">{{ item.locador }}</td>
            <td class="text-left">{{ item.logradouro }}</td>
            <td class="text-left">{{ item.valor }}</td>
            <td class="text-left">{{ item.typeEnsurance}}</td>
            <td class="text-left">{{ item.dataReajuste }}</td>
            <td class="text-left">{{ item.indiceReajuste }}</td>
            <td class="text-left">{{ item.dataVencimento }}</td>
            <td class="text-left">{{ item.typeContract }}</td>
            <td class="text-center">
              <v-btn color="blue" icon @click="getContract(item.id)">
                <v-icon>mdi-file-word</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn color="green" icon @click="getReceipt(item.id)">
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
          <v-btn color="primary" @click="newPrice(0)">Reajustar Selecionados</v-btn>
        </v-col>
      </v-row> 

       <!-- Modal for Adjusting Contracts -->
      <v-dialog v-model="showAdjustModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Reajustar Contratos</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="adjustForm" v-model="valid">
              <v-text-field
                v-model="adjustValue"
                label="Valor de Reajuste (%)"
                type="number"
                step="0.01"
                required
                :rules="[v => !!v || 'O valor é obrigatório', v => v > 0 || 'O valor deve ser maior que zero']"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="showAdjustModal = false">Cancelar</v-btn>
            <v-btn color="green darken-1" @click="confirmAdjustment" :disabled="!valid">Confirmar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="showPlanoContasModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Lançar no Plano de Contas?</span>
          </v-card-title>
          <v-card-text>
            <p>Deseja lançar essa operação no plano de contas?</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="showPlanoContasModal = false">Cancelar</v-btn>
            <v-btn color="green darken-1" @click="confirmPlanoContas">Confirmar</v-btn>
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

      <v-dialog v-model="showLocadorModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Selecione o Locador</span>
          </v-card-title>
          <v-card-text>
            <v-radio-group v-model="selectedLocadorId">
              <v-radio
                v-for="locador in locadoresModalList"
                :key="locador.id"
                :label="locador.nome"
                :value="locador.id"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="showLocadorModal = false">Cancelar</v-btn>
            <v-btn color="green darken-1" @click="confirmLocadorSelection">Confirmar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>    
    </v-container>
  </template>
  

  <script>
import axios from 'axios';
import errorHandling from '@/utilities/errorHandling';
import { imovel, clearImovel } from '@/model/imovel.js';
//import { isVNode } from 'vue';

export default {
  props: {
    days: {
      type: Number,
      required: false
    },
    codigo: {
      type: String,
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
        { title: 'Valor', value: 'valor' , sortable: true },
        { title: 'Tipo_Seguro', value: 'typeEnsurance' , sortable: true },
        { title: 'Reajuste', value: 'dataReajuste' , sortable: true },
        { title: 'Índice', value: 'indiceReajuste' , sortable: true },
        { title: 'Vencimento', value: 'dataVencimento' , sortable: true },
        { title: 'Prazo', value: 'typeContract' , sortable: true },
        { title: 'Gerar', value: 'edit' , sortable: false },
        { title: 'Recibo', value: 'delete' , sortable: false  },
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
      valid: false,
      selected: [],
      selectAll: false,
      showLocadorModal: false,
      locadoresModalList: [],
      selectedLocadorId: null,
      selectedImovelIdForReceipt: null,
      selectedLocatarioIdForReceipt: null,
      selectedLocadorIdForReceipt: null,
      showPlanoContasModal: false,
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
      await this.fetchImoveisFilter();
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
        // console.log('data inicio',this.dateStart);        
        // console.log('data inicio editada',this.dateStart.toISOString().substring(0, 10));
        
        // console.log('data fim',this.dateEnd);
        // console.log('data fim editada',this.dateEnd.toISOString().substring(0, 10));
        // Construir o objeto de parâmetros com valores diretamente das variáveis reativas
        const params = {
          filterId: this.clienteId,
          StartDate: this.dateStart ? this.dateStart.toISOString().substring(0, 10) : null,
           EndDate: this.dateEnd ? this.dateEnd.toISOString().substring(0, 10) : null,
           filterCod: this.codigo,
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
    async getContract(id) {
      try {
            const response = await axios.get(`/api/Document/gerarcontrato/${id}`, {
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
    // async getReceipt(id) {
    //   try {
    //         const response = await axios.get(`/api/Document/gerarrecibo/${id}`, {
    //           responseType: 'blob' // Importante para tratar a resposta como um Blob
    //         });

    //             // Extrair o nome do arquivo do cabeçalho de disposição de conteúdo
    //         const contentDisposition = response.headers['content-disposition'];
    //         let filename = 'Recibo.docx'; // Nome padrão se o cabeçalho não estiver presente
    //         if (contentDisposition) {
    //           const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    //           if (filenameMatch.length > 1) {
    //             filename = filenameMatch[1];
    //           }
    //         }

    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', filename); // Define o nome do arquivo
    //         document.body.appendChild(link);
    //         link.click();
    //         this.showSnackBar(`Recibo gerado com Sucesso`,'success');    
    //   } catch (error) {
    //     this.handleGlobalError(error, 'Erro ao gerar documento');
    //   }
    // },
    async getReceipt(id) {
      try {
        const imovel = this.imoveis.find(item => item.id === id);
        let isOk  = false;
        if (imovel && imovel.locadores && imovel.locadores.length > 0) {
          // Usando diretamente a lista de locadores do ImovelViewModel
          this.locadoresModalList = imovel.locadores;

          isOk = true;
        } else {
          this.handleGlobalError('Nenhum locador disponível para este imóvel.');
        }
        if (imovel && imovel.locatarios && imovel.locatarios.length > 0) {
          // Usando diretamente a lista de locadores do ImovelViewModel
          this.locatariosModalList = imovel.locatarios;

          isOk = true;
        } else {
          this.handleGlobalError('Nenhum locatário disponível para este imóvel.');
        }

        if(isOk)
        {
          // Abrir o modal
          this.selectedImovelIdForReceipt = id;
          this.showLocadorModal = true;
        }
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar locadores');
      }
    },


    confirmLocadorSelection() {
      //if (this.selectedLocadorId !== null && this.selectedLocatarioId) {
      if (this.selectedLocadorId !== null) {
        const selectedLocador = this.locadoresModalList.find(locador => locador.id === this.selectedLocadorId);
        //const selectedLocatario = this.locatariosModalList.find(locatario => locatario.id === this.selectedLocatarioId);
        if (selectedLocador) {
          // Chamar a API para gerar o recibo com o ID do locador selecionado
          //this.generateReceipt(this.selectedImovelIdForReceipt, selectedLocador.id,selectedLocatario.id);
          this.generateReceipt(this.selectedImovelIdForReceipt, selectedLocador.id,0);
          this.showLocadorModal = false;
        }
      }
    },

    async generateReceipt(imovelId, locadorId,locatarioId) {
      try {
        const response = await axios.get(`/api/Document/gerarrecibo/${imovelId}`, {
          params: { locadorId }, // Passando o ID do locador como parâmetro
          responseType: 'blob' // Importante para tratar a resposta como um Blob
        });

        // Extrair o nome do arquivo do cabeçalho de disposição de conteúdo
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'Recibo.docx'; // Nome padrão se o cabeçalho não estiver presente
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
        this.showSnackBar(`Recibo gerado com Sucesso`, 'success');
        
        // Após gerar o recibo, perguntar se deseja lançar no plano de contas
        this.selectedImovelIdForReceipt = imovelId;
        this.selectedLocadorIdForReceipt = locadorId;
        this.selectedLocatarioIdForReceipt = locatarioId;
        //this.showPlanoContasModal = true;
        
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao gerar documento');
      }
    },    

    async confirmPlanoContas() {
      try {
        const responseRequest = await axios.post(`/api/Conta/automatic/${this.selectedImovelIdForReceipt}?idLocador=${this.selectedLocadorIdForReceipt}?idLocatario=${this.selectedLocatarioIdForReceipt}`);
          if (responseRequest.status === 201) {
            this.showSnackBar('Lançamento no plano de contas realizado com sucesso!', 'success');
          } else {
            this.showSnackBar('Erro ao lançar no plano de contas','error');
          }       
        this.showPlanoContasModal = false;
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao lançar no plano de contas');
      }
    },

    async newPrice(id) {
      try {
            this.showAdjustModal = true;
            this.adjustValue = 0;
            if(id>0)
            {
              this.selectedImovelId = id;
              const response = await axios.get(`/api/Imovels/${id}`);
              console.log('Dados do imovel Recebidos:', response.data);
              imovel.value = response.data;
              this.adjustValue = response.data.reajuste;        
              this.selected = [];   
              this.selected.push(id);
            }                        
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao gerar documento');
      }
    },
   async loadContratos() {
        if (this.days) {
            this.dateEnd = new Date();
            this.dateStart = new Date(this.dateEnd);
            this.dateStart.setDate(this.dateEnd.getDate()-this.days);
            // Lógica para carregar contratos com base em `days`
            console.log(`Carregando contratos para ${this.days} dias, com data inicial ${this.dateStart} e data final ${this.dateEnd}`);
            await this.fetchImoveisFilter();
            // Adicione a lógica para buscar e exibir contratos aqui
        }
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
    toggleItemSelection(item) {
      console.log(item);
      // const index = this.selected.findIndex(selectedItem => selectedItem.id === item.id);
      // if (index === -1) {
      //   this.selected.push(item);
      // } else {
      //   this.selected.splice(index, 1);
      // }
      // console.log(this.selected);
    },
    toggleSelectAll (){
      if (this.selectAll) {
        this.selected = this.imoveis.map(item => item.id);
      } else {
        this.selected = [];
      }
    }
  },
  watch: {
    selected(newValue, oldValue) {
      console.log(`Message changed from "${oldValue}" to "${newValue}"`);
      console.log(this.selected);
    },
    days: 'loadContratos'
  },
  mounted() {
    this.loadContratos();
  }  
}
</script>
