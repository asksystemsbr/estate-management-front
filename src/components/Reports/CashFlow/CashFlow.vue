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
        @update:modelValue="handleDateChangeEndInsure"
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
      :items="filteredItems"
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

    <!-- Pie Chart -->
    <v-row class="mt-4">
      <v-col>
        <div v-if="loading" style="text-align: center;">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else style="max-width: 400px; margin: 0 auto;">
          <pie-chart :data="chartData" :options="chartOptions" ref="pieChart"></pie-chart>
        </div>
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  components: {
    PieChart: Pie,
  },
  mixins: [errorHandling],
  data() {
    return {
      clientes: [],
      headers: [
        { title: 'Descrição', value: 'desc', sortable: true },
        { title: 'Valor', value: 'val', sortable: true },
        { title: 'Data', value: 'date', sortable: true },
        { title: 'Tipo', value: 'type', sortable: true },
        { title: 'Pagamento', value: 'paymentType', sortable: true },
      ],
      search: '',
      currentDeleteId: null,
      selectedClientId: 0,
      menuOpenEnd: false,
      menuOpenStart: false,
      // Define a data inicial como o primeiro dia do mês atual
      dateStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      // O último dia do mês pode ser encontrado ao criar uma data do "primeiro dia" do próximo mês e subtrair um dia.
      dateEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000,
      },
      chartData: {
        labels: ['Recebido', 'Pago'],
        datasets: [
          {
            label: 'Percentual',
            backgroundColor: ['#36A2EB', '#FF6384'],
            data: [0, 0],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      loading: true,
    };
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.clientes;
      }
      return this.clientes.filter((cliente) => {
        return Object.values(cliente).some((value) =>
          String(value).toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
    formattedDateEnd() {
      return this.dateEnd
        ? new Date(this.dateEnd).toLocaleDateString('pt-BR')
        : '';
    },
    formattedDateStart() {
      return this.dateStart
        ? new Date(this.dateStart).toLocaleDateString('pt-BR')
        : '';
    },
    totReceived() {
      return this.filteredItems
        .filter((item) => item.type === 'RECEBIDO')
        .reduce((sum, item) => sum + item.val, 0);
    },
    totPayed() {
      return this.filteredItems
        .filter((item) => item.type === 'PAGO')
        .reduce((sum, item) => sum + item.val, 0);
    },
    tot() {
      return this.totReceived - this.totPayed;
    },
    percentReceived() {
      const total = this.totReceived + this.totPayed;
      return total > 0 ? (this.totReceived / total) * 100 : 0;
    },
    percentPayed() {
      const total = this.totReceived + this.totPayed;
      return total > 0 ? (this.totPayed / total) * 100 : 0;
    },
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
    },
    filteredItems() {
      this.updateChartData();
    },
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      if (!this.dateStart || !this.dateEnd) return;
      this.loading = true;
      try {
        const response = await axios.get('/api/ReportFinances/getItemsView', {
          params: {
            dtStart: this.dateStart.toISOString(),
            dtEnd: this.dateEnd.toISOString(),
          },
        });
        const data = response.data;
        this.clientes = data.itemsPayed.concat(data.itemsReceived);
        this.updateChartData();
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      } finally {
        this.loading = false;
      }
    },
    handleDateChangeEndInsure(value) {
      this.dateEnd = value;
      this.menuOpenEnd = false;
    },
    handleDateChangeStartInsure(value) {
      this.dateStart = value;
      this.menuOpenStart = false;
    },
    updateChartData() {
      this.chartData.datasets[0].data = [
        this.percentReceived,
        this.percentPayed,
      ];
      // Force chart to update
      this.$nextTick(() => {
        if (this.$refs.pieChart && this.$refs.pieChart.$data._chart) {
          this.$refs.pieChart.$data._chart.update();
        }
      });
    },
    async exportToExcel() {
      try {
          const data = [
            ['Descrição', 'Valor', 'Data', 'Tipo', 'Pagamento'],
            ...this.filteredItems.map((cliente) => [
              cliente.desc,
              this.formatCurrency(cliente.val),
              this.formatDate(cliente.date),
              cliente.type,
              cliente.paymentType,
            ]),
            [],
            ['Total Recebido', this.formatCurrency(this.totReceived)],
            ['Total Pago', this.formatCurrency(this.totPayed)],
            ['Total', this.formatCurrency(this.tot)],
          ];

             // Create a workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Fluxo de Caixa');

        // Add data to the worksheet
        worksheet.addRows(data);

        // Set column widths
        const columnWidths = [
          { header: 'Descrição', key: 'desc', width: 30 },
          { header: 'Valor', key: 'val', width: 20 },
          { header: 'Data', key: 'date', width: 15 },
          { header: 'Tipo', key: 'type', width: 15 },
          { header: 'Pagamento', key: 'paymentType', width: 20 },
        ];

        worksheet.columns = columnWidths.map(col => ({ header: col.header, key: col.key, width: col.width }));

        await this.$nextTick(); // Aguarde a próxima renderização do DOM
        const chartCanvas = this.$refs.pieChart.chart.canvas;

        if (chartCanvas) {
          const chartImage = await html2canvas(chartCanvas).then((canvas) =>
            canvas.toDataURL('image/png')
          );

          // Adicionar o gráfico ao Excel
          const imageId = workbook.addImage({
            base64: chartImage,
            extension: 'png',
          });

          worksheet.addImage(imageId, 'G1:M18'); // Ajuste o range conforme necessário
        }

            // Write to file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `relatorio_fluxo_caixa.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }catch (error) {
        console.error("Erro ao gerar o Excel:", error);
        this.showSnackBar("Erro ao gerar o Excel", "error");
      }
    },
    async exportToPDF() {
      try {
        const doc = new jsPDF('landscape');
        doc.text(`Relatório de Fluxo de Caixa`, 100, 20);
        doc.autoTable({
          startY: 30,
          head: [['Descrição', 'Valor', 'Data', 'Tipo', 'Pagamento']],
          body: this.filteredItems.map((cliente) => [
            cliente.desc,
            this.formatCurrency(cliente.val),
            this.formatDate(cliente.date),
            cliente.type,
            cliente.paymentType,
          ]),
        });

        await this.$nextTick(); // Aguarde a próxima renderização do DOM
        const chartCanvas = this.$refs.pieChart.chart.canvas;
        if (chartCanvas) {
          const chartImage = await html2canvas(chartCanvas).then((canvas) =>
            canvas.toDataURL('image/png')
          );

          doc.addImage(chartImage, 'PNG', 100, doc.previousAutoTable.finalY + 10, 100, 50);
        }

        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 80,
          body: [
            ['Total Recebido', this.formatCurrency(this.totReceived)],
            ['Total Pago', this.formatCurrency(this.totPayed)],
            ['Total', this.formatCurrency(this.tot)],
          ],
        });

        doc.save(`relatorio_fluxo_caixa.pdf`);
      } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        this.showSnackBar("Erro ao gerar o PDF", "error");
      }
    },
    formatCurrency(value) {
      if (value === undefined || value === null) {
        return "R$ 0,00";
      }
      if (typeof value !== 'string') {
        value = value.toString();
      }
      return parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR');
    },
    showSnackBar(message,color)
    {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>
