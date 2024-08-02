<template>
    <v-container>
      <!-- Título e botão para adicionar nova conta -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1>Contas - {{ titulo }}</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click.stop="AddNew()">Nova Conta</v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <!-- Filtros de categoria e subcategoria -->
        <v-col cols="6">
          <v-select
            v-model="selectedCategoria"
            :items="categorias"
            label="Categoria"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="selectedSubCategoria"
            :items="subcategorias"
            label="SubCategoria"
            outlined
          ></v-select>
        </v-col>
      </v-row>
  
      <!-- Filtro de busca -->
      <v-text-field
        v-model="search"
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
      ></v-text-field>
  
      <!-- Tabela de dados -->
      <v-data-table
        :items="contasFiltradas"
        :headers="headers"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.ContaNome }}</td>
            <td class="text-left">{{ formatCurrency(item.Valor) }}</td>
            <td class="text-left">{{ formatCurrency(item.ValorPagoRecebido) }}</td>
            <td class="text-left">{{ item.Categoria }}</td>
            <td class="text-left">{{ item.SubCategoria }}</td>
            <td class="text-left">{{ formatDate(item.DtVencimento) }}</td>
          </tr>
        </template>
      </v-data-table>
  
      <!-- Botões para exportar -->
      <v-row justify="end">
        <v-btn color="success" @click="exportToExcel">Exportar para Excel</v-btn>
        <v-btn color="info" @click="exportToPDF">Exportar para PDF</v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  //import { saveAs } from 'file-saver';
  import * as XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  
  export default {
    props: {
      titulo: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        contas: [],
        categorias: [], // Carregar as categorias do backend
        subcategorias: [], // Carregar as subcategorias do backend
        selectedCategoria: null,
        selectedSubCategoria: null,
        search: '',
        headers: [
          { text: 'Nome da Conta', value: 'ContaNome' },
          { text: 'Valor da Conta', value: 'Valor' },
          { text: 'Valor Total Pago', value: 'ValorPagoRecebido' },
          { text: 'Categoria', value: 'Categoria' },
          { text: 'SubCategoria', value: 'SubCategoria' },
          { text: 'Data do Vencimento', value: 'DtVencimento' }
        ]
      };
    },
    computed: {
      contasFiltradas() {
        let filtered = this.contas;
        if (this.selectedCategoria) {
          filtered = filtered.filter(conta => conta.CategoriaId === this.selectedCategoria);
        }
        if (this.selectedSubCategoria) {
          filtered = filtered.filter(conta => conta.SubCategoriaId === this.selectedSubCategoria);
        }
        return filtered;
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('/api/Conta/getItemsView');
          this.contas = response.data;
          // Carregar categorias e subcategorias
          const categoriasResponse = await axios.get('/api/ContaCategoria');
          this.categorias = categoriasResponse.data;
          const subcategoriasResponse = await axios.get('/api/ContaSubCategoria');
          this.subcategorias = subcategoriasResponse.data;
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      },
      formatCurrency(value) {
        return parseFloat(value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR');
      },
      exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(this.contasFiltradas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Contas');
        XLSX.writeFile(wb, 'contas.xlsx');
      },
      exportToPDF() {
        const doc = new jsPDF();
        doc.text('Relatório de Contas', 20, 20);
        doc.autoTable({
          head: [['Nome da Conta', 'Valor da Conta', 'Valor Total Pago', 'Categoria', 'SubCategoria', 'Data do Vencimento']],
          body: this.contasFiltradas.map(conta => [
            conta.ContaNome,
            this.formatCurrency(conta.Valor),
            this.formatCurrency(conta.ValorPagoRecebido),
            conta.Categoria,
            conta.SubCategoria,
            this.formatDate(conta.DtVencimento)
          ])
        });
        doc.save('contas.pdf');
      },
      AddNew() {
        // Lógica para adicionar nova conta
      }
    }
  };
  </script>
  