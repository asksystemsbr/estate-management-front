<template>
    <v-container>
    <!-- Row para título e botão -->
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h1>Contas - {{ titulo }}</h1>
      </v-col>
    </v-row>
    <br><br> 
      <!-- Filtro de busca -->
      <v-text-field
        v-model="search"
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
      ></v-text-field>

        <br> 
      <v-data-table
        :items="filteredItems"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.contaNome }}</td>
            <td class="text-left">{{ item.imovel }}</td>
            <td class="text-left">{{ formatCurrency(item.valor) }}</td>
            <td class="text-left">{{ formatCurrency(item.valorPagoRecebido) }}</td>   
            <td class="text-left">{{ item.categoria }}</td>
            <td class="text-left">{{ item.subCategoria }}</td>
            <td class="text-left">{{ formatDate(item.dtVencimento) }}</td>         
          </tr>
        </template>
      </v-data-table>
      <br><br> 
        <!-- Botões para exportar -->
        <v-row justify="end">
            <v-btn color="success" @click="exportToExcel" class="mr-2">Exportar para Excel</v-btn>
            <v-btn color="info" @click="exportToPDF">Exportar para PDF</v-btn>
        </v-row>
        <!-- Snackbar for displaying login status -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="snackbar.timeout"
        >
          {{ snackbar.message }}
          <template v-slot:action>
            <v-btn text color="white" @click="snackbar.show = false">
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
  props: {
    titulo: {
      type: String,
      required: true
    }
  },  
    data() {
      return {
        contas: [],
        headers: [
          { title: 'Código', value: 'codigo', sortable: true },
          { title: 'Descrição', value: 'contaNome', sortable: true },
          { title: 'Imóvel', value: 'imovel', sortable: true },
          { title: 'Valor Conta', value: 'valor', sortable: true },
          { title: 'Valor Quitado', value: 'valorPagoRecebido', sortable: true },  
          { title: 'Categoria', value: 'categoria', sortable: true },
          { title: 'SubCategoria', value: 'subCategoria', sortable: true },
          { title: 'Vencimento', value: 'dtVencimento', sortable: true },        
        ],
        showDeleteConfirm: false,
        currentDeleteId: null,
        search: '',
        selectedTipo: 0,
        showEditModal: false,
        showAddModal: false,
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
            return this.contas;
        }
        return this.contas.filter(conta => {
            return Object.values(conta).some(value =>
            String(value).toLowerCase().includes(this.search.toLowerCase())
            );
        });
        }
    },    
    created() {
      this.fetch();
    },
    methods: {
      async fetch() {
        try {
          const response = await axios.get(`/api/Conta/getItemsView/${this.titulo}`);
          this.contas = response.data;
        } catch (error) {
          this.handleGlobalError(error, 'Failed to fetch register.');
        }
      },
        // Método para atualizar a lista após edição
        handleUpdate() {
            this.showEditModal = false;
            this.showAddModal = false;
            this.showSnackBar(`Registro Salvo com Sucesso`,'success');
            this.fetch();
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
      this.fetch();
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
        const title = `Relatório de Contas - ${this.titulo}`;
        const data = this.filteredItems.map(conta => [
                conta.contaNome,
                conta.imovel,
                this.formatCurrency(conta.valor),
                this.formatCurrency(conta.valorPagoRecebido),
                conta.categoria,
                conta.subCategoria,
                this.formatDate(conta.dtVencimento)
            ]);
        
        data.unshift([]); // Linha vazia
        data.unshift([title]); // Título do relatório
        // Adicionar cabeçalhos de coluna
        data.splice(2, 0, ['Nome Conta', 'Imóvel', 'Valor Conta', 'Valor Quitado', 'Categoria', 'SubCategoria', 'Vencimento']);

        const ws = XLSX.utils.aoa_to_sheet(data);
         // Ajustar largura das colunas
        ws['!cols'] = [
            { wch: 30 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 }
        ];

        // Criar e salvar o arquivo Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Contas');
        XLSX.writeFile(wb, `contas_${this.titulo}.xlsx`);
      },
      exportToPDF() {
        const doc = new jsPDF('landscape');// Definir orientação horizontal
        doc.text(`Relatório de Contas- ${this.titulo}`, 100, 20);
        doc.autoTable({
         startY: 30, // Definir posição de início da tabela
          head: [['Nome Conta', 'Imóvel','Valor da Conta', 'Valor Quitado', 'Categoria', 'SubCategoria', 'Data do Vencimento']],
          body: this.filteredItems.map(conta => [
            conta.contaNome,
            conta.imovel,
            this.formatCurrency(conta.valor),
            this.formatCurrency(conta.valorPagoRecebido),
            conta.categoria,
            conta.subCategoria,
            this.formatDate(conta.dtVencimento)
          ])
        });
        doc.save(`contas_${this.titulo}.pdf`);
      },
    }
  };
  </script>