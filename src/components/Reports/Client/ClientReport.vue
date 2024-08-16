<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Clientes</h1>
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
        :items="clientes"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.codigo_cliente }}</td>
            <td class="text-left">{{ item.nome }}</td>
            <td class="text-left">{{ item.celular }}</td>
            <td class="text-left">{{ item.logradouro }}</td>
            <td class="text-left">{{ item.numero }}</td>
            <td class="text-left">{{ item.bairro }}</td>
            <td class="text-left">{{ item.situacao }}</td>
          </tr>
        </template>
      </v-data-table>
  
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
      { title: 'Código', value: 'codigo_cliente' , sortable: true },
        { title: 'Nome', value: 'nome' , sortable: true },        
        { title: 'Celular', value: 'celular' , sortable: true },
        { title: 'Logradouro', value: 'logradouro' , sortable: true },
        { title: 'Número', value: 'numero' , sortable: true },
        { title: 'Bairro', value: 'bairro' , sortable: true },
        { title: 'Situação', value: 'situacao' , sortable: true },
      ],
      search: '',
      currentDeleteId: null,      
      selectedClientId: 0,
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
        }
    },   
  created() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      try {
        const response = await axios.get('/api/Cliente/getItemsView');
        this.clientes = response.data;
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
    exportToExcel() {
        const title = `Relatório de Clientes`;
        const data = this.filteredItems.map(cliente => [
        cliente.codigo_cliente,
        cliente.nome,
        cliente.celular,
        cliente.logradouro,
        cliente.numero,
        cliente.bairro,
        cliente.situacao
            ]);
        
        data.unshift([]); // Linha vazia
        data.unshift([title]); // Título do relatório
        // Adicionar cabeçalhos de coluna
        data.splice(2, 0, ['Código', 'Nome', 'Celular', 'Logradouro', 'Num', 'Bairro', 'Situação']);

        const ws = XLSX.utils.aoa_to_sheet(data);
         // Ajustar largura das colunas
        ws['!cols'] = [
            { wch: 15 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 10 },
            { wch: 15 },
            { wch: 15 }
        ];

        // Criar e salvar o arquivo Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        XLSX.writeFile(wb, `clientes.xlsx`);
      },
      exportToPDF() {
        const doc = new jsPDF('landscape');// Definir orientação horizontal
        doc.text(`Relatório de Clientes`, 100, 20);
        doc.autoTable({
         startY: 30, // Definir posição de início da tabela
          head: [['Código', 'Nome','Celular', 'Logradouro', 'Num', 'Bairro', 'Situação']],
          body: this.filteredItems.map(cliente => [
                cliente.codigo_cliente,
                cliente.nome,
                cliente.celular,
                cliente.logradouro,
                cliente.numero,
                cliente.bairro,
                cliente.situacao
          ])
        });
        doc.save(`clientes.pdf`);
      },
  }
}
</script>
