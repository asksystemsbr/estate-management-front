<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Fluxo de Caixa</h1>
        </v-col>
      </v-row>
      <br><br>

      <v-menu
            ref="menu"
            v-model="menuOpenStart"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ attrs }">
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
              @input="handleDateChangeStartInsure"
              @update:modelValue="handleDateChangeStartInsure"
              no-title
            ></v-date-picker>
          </v-menu>


          <v-menu
            ref="menu"
            v-model="menuOpenEnd"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ attrs }">
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
              @input="handleDateChangeEndInsure"
              @update:modelValue="handleDateChangeEndtInsure"
              no-title
            ></v-date-picker>
          </v-menu>
  
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
        :items="clientes"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.desc }}</td>
            <td class="text-left">{{ formatCurrency(item.val) }}</td>
            <td class="text-left">{{ formatDate(item.date) }}</td>    
            <td class="text-left">{{ item.type }}</td>
            <td class="text-left">{{ item.paymentType }}</td>
          </tr>
        </template>
      </v-data-table>
  
         <!-- Totals -->
    <v-row class="mt-4">
      <v-col class="text-right" cols="12">
        <v-row>
          <v-col class="text-right" cols="12">
            <strong class="text-primary">Total Recebido: {{ formatCurrency(totReceived) }}</strong>
          </v-col>
          <v-col class="text-right text-danger-custom" cols="12">
            <strong>Total Pago: {{ formatCurrency(totPayed) }}</strong>
          </v-col>
          <v-col class="text-right" cols="12">
            <strong class="text-dark">Total: {{ formatCurrency(tot) }}</strong>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

      <br><br> 
        <!-- Botões para exportar -->
        <v-row align="center" justify="space-between">
          <v-col cols="auto">
            <v-btn color="success" @click="exportToExcel" class="mr-2">Exportar Excel</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="info" @click="exportToPDF">Exportar PDF</v-btn>
          </v-col>
        </v-row>


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
  <style>
  .text-danger-custom {
    color: red;
  }
  </style>

  <script>
import axios from 'axios';
import errorHandling from '@/utilities/errorHandling';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  components: {
  },
  mixins: [errorHandling],
  data() {
    return {
      clientes: [],
      headers: [
      { title: 'Descrição', value: 'desc' , sortable: true },
        { title: 'Valor', value: 'val' , sortable: true },        
        { title: 'Data', value: 'date' , sortable: true },
        { title: 'Tipo', value: 'type' , sortable: true },
        { title: 'Pagamento', value: 'paymentType' , sortable: true },
      ],
      search: '',
      currentDeleteId: null,      
      selectedClientId: 0,
      menuOpenEnd:false,
      menuOpenStart:false,
      dateStart: null,
      dateEnd: null,
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000
      },      
    };
  },
  computed: {
        filteredItems() {
        if (!this.search) {
            return this.clientes;
        }
        return this.clientes.filter(cliente => {
            return Object.values(cliente).some(value =>
            String(value).toLowerCase().includes(this.search.toLowerCase())
            );
        });
        },
        formattedDateEnd () {
            return this.dateEnd
            ? new Date(this.dateEnd).toLocaleDateString('pt-BR')
            : '';
        },
        formattedDateStart () {
            return this.dateStart
            ? new Date(this.dateStart).toLocaleDateString('pt-BR')
            : '';
        },
        totReceived() {
      return this.filteredItems
        .filter(item => item.type === 'RECEBIDO')
        .reduce((sum, item) => sum + item.val, 0);
        },
        totPayed() {
          return this.filteredItems
            .filter(item => item.type === 'PAGO')
            .reduce((sum, item) => sum + item.val, 0);
        },
        tot() {
          return this.totReceived - this.totPayed;
        }        
    },   
    watch: {
    dateStart(val) {
      if (val) {
        this.fetchClients();
      }
    },
    dateEnd(val) {
      if (val) {
        this.fetchClients();
      }
    }
  },
  methods: {
    async fetchClients() {
        if (!this.dateStart || !this.dateEnd) return;
      try {
        const response = await axios.get('/api/ReportFinances/getItemsView', {
          params: {
            dtStart: this.dateStart.toISOString(),
            dtEnd: this.dateEnd.toISOString()
          }
        });
        const data = response.data;
        this.clientes = data.itemsPayed.concat(data.itemsReceived);
        this.totReceived = data.totReceived;
        this.totPayed = data.totPayed;
        this.tot = data.tot;
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
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
      this.fetchClients();
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
    formatCurrency (value) {
        if (value === undefined || value === null) {
            return "R$ 0,00"; 
        }
        if (typeof value !== 'string') {
          value = value.toString();
        }
        return parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      },
      formatDate (date) {
        return new Date(date).toLocaleDateString('pt-BR');
      },  
      handleDateChangeEndtInsure (value) {
        this.dateEnd  = value;
        this.menuOpenEnd = false;
        },
     handleDateChangeStartInsure (value) {
        this.dateStart  = value;
        this.menuOpenStart = false;
        },
    exportToExcel() {
        const title = `Relatório de Fluxo de Caixa`;
        const data = [
            ['Descrição', 'Valor', 'Data', 'Tipo', 'Pagamento'],
            ...this.clientes.map(cliente => [
            cliente.desc,
            this.formatCurrency(cliente.val),
            this.formatDate(cliente.date),
            cliente.type,
            cliente.paymentType
            ]),
            [],
            ['Total Recebido', this.formatCurrency(this.totReceived)],
            ['Total Pago', this.formatCurrency(this.totPayed)],
            ['Total', this.formatCurrency(this.tot)]
        ];
        
        data.unshift([]); // Linha vazia
        data.unshift([title]); // Título do relatório
        // Adicionar cabeçalhos de coluna
        //data.splice(2, 0, ['Descrição', 'Valor', 'Data', 'Tipo', 'Pagamento']);

        const ws = XLSX.utils.aoa_to_sheet(data);
         // Ajustar largura das colunas
        ws['!cols'] = [
            { wch: 15 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 10 }
        ];

        // Criar e salvar o arquivo Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Fluxo de Caixa');
        XLSX.writeFile(wb, `relatorio_fluxo_caixa.xlsx`);
      },
      exportToPDF() {
        const doc = new jsPDF('landscape');// Definir orientação horizontal
        doc.text(`Relatório de Fluxo de Caixa`, 100, 20);
        doc.autoTable({
         startY: 30, // Definir posição de início da tabela
          head: [['Descrição', 'Valor','Data', 'Tipo', 'Pagamento']],
          body: this.filteredItems.map(cliente => [
                cliente.desc,
                this.formatCurrency(cliente.val),
                this.formatDate(cliente.date),
                cliente.type,
                cliente.paymentType
          ])
        });
        
        doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        body: [
          ['Total Recebido', this.formatCurrency(this.totReceived)],
          ['Total Pago', this.formatCurrency(this.totPayed)],
          ['Total', this.formatCurrency(this.tot)]
        ]
      });
        doc.save(`relatorio_fluxo_caixa.pdf`);
      },
  }
}
</script>
