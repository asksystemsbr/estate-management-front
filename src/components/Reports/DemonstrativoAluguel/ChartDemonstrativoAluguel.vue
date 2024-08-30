<template>
  <v-container>
    <v-row  align="center" justify="center">        
      <v-col cols="12" md="12">
        <v-select
            v-model="selectedLocadorId"
            :items="locadoresDisponiveis"
            label="Selecione um Locador"
            item-title="nomeLocador"
            item-value="id"  
        ></v-select>
      </v-col>
    </v-row>       
    <!-- Filtros de Data -->
    <v-row align="center" justify="center">        
      <v-col cols="12" md="12">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Selecione um Ano"
          item-title="year"
          item-value="year"
        ></v-select>
      </v-col>
    </v-row>    
    <v-row>
      <v-col>
        <v-btn color="primary" @click="fetchData" :disabled="!isFormValid">Buscar</v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <h2>Locador: {{ report.locadorNome }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <h2>CPF/CNPJ: {{ report.locadorCPF }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <h2>Pasta: {{ report.locadorPasta }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


     <!-- Informações dos Locatários -->
       <!-- Informações dos Locatários -->
       <v-divider class="my-4"></v-divider>
    <div v-for="(locatario, index) in report.locatarios" :key="index">
      <v-row>
        <v-col>
          <v-card>
            <v-card-text>
              <h2>Locatário: {{ locatario.locatarioNome }}</h2>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-text>
              <h2>CPF/CNPJ: {{ locatario.locatarioCPF }}</h2>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabela de Rendimentos -->
      <h3>Rendimentos:</h3>
      <v-data-table :headers="monthHeaders" :items="formattedRendimentos(locatario.rendimentos)" item-key="descricao" class="elevation-1 mt-5">
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-left">{{ item.descricao }}</td>
            <td class="text-left">{{ item.jan }}</td>
            <td class="text-left">{{ item.feb }}</td>
            <td class="text-left">{{ item.mar }}</td>
            <td class="text-left">{{ item.apr }}</td>
            <td class="text-left">{{ item.may }}</td>
            <td class="text-left">{{ item.jun }}</td>
            <td class="text-left">{{ item.jul }}</td>
            <td class="text-left">{{ item.aug }}</td>
            <td class="text-left">{{ item.sep }}</td>
            <td class="text-left">{{ item.oct }}</td>
            <td class="text-left">{{ item.nov }}</td>
            <td class="text-left">{{ item.dec }}</td>
            <td class="text-left">{{ formatCurrency(item.total) }}</td>
          </tr>
        </template>
      </v-data-table>

      <!-- Tabela de Deduções -->
      <h3>Deduções:</h3>
      <v-data-table :headers="monthHeaders" :items="formattedDeducoes(locatario.deducoes)" item-key="descricao" class="elevation-1 mt-5">
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-left">{{ item.descricao }}</td>
            <td class="text-left">{{ item.jan }}</td>
            <td class="text-left">{{ item.feb }}</td>
            <td class="text-left">{{ item.mar }}</td>
            <td class="text-left">{{ item.apr }}</td>
            <td class="text-left">{{ item.may }}</td>
            <td class="text-left">{{ item.jun }}</td>
            <td class="text-left">{{ item.jul }}</td>
            <td class="text-left">{{ item.aug }}</td>
            <td class="text-left">{{ item.sep }}</td>
            <td class="text-left">{{ item.oct }}</td>
            <td class="text-left">{{ item.nov }}</td>
            <td class="text-left">{{ item.dec }}</td>
            <td class="text-left">{{ formatCurrency(item.total) }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <!-- Totais Gerais -->
    <v-divider class="my-4"></v-divider>
    <h2>Totais Gerais:</h2>
    <h3>Rendimentos:</h3>
    <v-data-table :headers="monthHeaders" :items="formattedTotals(totalRendimentos)" item-key="descricao" class="elevation-1 mt-5">
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-left">{{ item.descricao }}</td>
          <td class="text-left">{{ item.jan }}</td>
          <td class="text-left">{{ item.feb }}</td>
          <td class="text-left">{{ item.mar }}</td>
          <td class="text-left">{{ item.apr }}</td>
          <td class="text-left">{{ item.may }}</td>
          <td class="text-left">{{ item.jun }}</td>
          <td class="text-left">{{ item.jul }}</td>
          <td class="text-left">{{ item.aug }}</td>
          <td class="text-left">{{ item.sep }}</td>
          <td class="text-left">{{ item.oct }}</td>
          <td class="text-left">{{ item.nov }}</td>
          <td class="text-left">{{ item.dec }}</td>
          <td class="text-left">{{ formatCurrency(item.total) }}</td>
        </tr>
      </template>
    </v-data-table>

    <h3>Deduções:</h3>
    <v-data-table :headers="monthHeaders" :items="formattedTotals(totalDeducoes)" item-key="descricao" class="elevation-1 mt-5">
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-left">{{ item.descricao }}</td>
          <td class="text-left">{{ item.jan }}</td>
          <td class="text-left">{{ item.feb }}</td>
          <td class="text-left">{{ item.mar }}</td>
          <td class="text-left">{{ item.apr }}</td>
          <td class="text-left">{{ item.may }}</td>
          <td class="text-left">{{ item.jun }}</td>
          <td class="text-left">{{ item.jul }}</td>
          <td class="text-left">{{ item.aug }}</td>
          <td class="text-left">{{ item.sep }}</td>
          <td class="text-left">{{ item.oct }}</td>
          <td class="text-left">{{ item.nov }}</td>
          <td class="text-left">{{ item.dec }}</td>
          <td class="text-left">{{ formatCurrency(item.total) }}</td>
        </tr>
      </template>
    </v-data-table>
    <br/>
    <br/>

    <!-- Botões para exportar -->
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <v-btn color="success" @click="exportToExcel" class="mr-2">Exportar Excel</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="info" @click="exportToPDF">Exportar PDF</v-btn>
      </v-col>
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
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  components: {
  },
  mixins: [errorHandling],
  props: {
  },  
  data() {
    return {
      headersRendimentos: [
        { text: 'Descrição', value: 'descricao' },
        { text: 'Mês', value: 'mes' },
        { text: 'Valor', value: 'valor' }
      ],
      headersDeducoes: [
        { text: 'Descrição', value: 'descricao' },
        { text: 'Mês', value: 'mes' },
        { text: 'Valor', value: 'valor' }
      ],
      monthHeaders: [
        { title: 'Descrição', text: 'Descrição', value: 'descricao' },
        { title: 'Jan',text: 'Jan', value: 'jan' },
        { title: 'Feb',text: 'Feb', value: 'feb' },
        { title: 'Mar',text: 'Mar', value: 'mar' },
        { title: 'Apr',text: 'Apr', value: 'apr' },
        { title: 'May',text: 'May', value: 'may' },
        { title: 'Jun',text: 'Jun', value: 'jun' },
        { title: 'Jul',text: 'Jul', value: 'jul' },
        { title: 'Aug',text: 'Aug', value: 'aug' },
        { title: 'Sep',text: 'Sep', value: 'sep' },
        { title: 'Oct',text: 'Oct', value: 'oct' },
        { title: 'Nov',text: 'Nov', value: 'nov' },
        { title: 'Dec',text: 'Dec', value: 'dec' },
        { title: 'Total',text: 'Total', value: 'total' }
      ],
      report:[],
      rendimentos: [],
      deducoes: [],
      totalRendimentos: [],
      totalDeducoes: [],
      years: [],
      reportData: [],
      locadoresDisponiveis: [],
      selectedLocadorId: 0,
      selectedYear: null,
      snackbar: {
            show: false,
            message: '',
            color: '',
            timeout: 3000
        },      
    };
  },
  computed: {
    isFormValid() {
      return this.selectedLocadorId && this.selectedYear !== null;
    },
    // filteredItems() {
    //     return this.receivedItems;
    // },
    // filteredPaid() {
    //     return this.discountItems;
    // },
  },  
  created() {
    // Chamada ao backend para obter os dados
    //this.fetchData();
    this.fetchLocatarios();
    this.generateYearOptions();
  },
  // watch: {
  //   async selectedImovelId(newVal) {
  //     if (newVal) {
  //       await this.fetchLocatarios();
  //     }
  //   }
  //   // async selectedLocadorId(newVal) {
  //   //   if (newVal) {
  //   //     this.contas.ClienteId = this.selectedLocadorId;
  //   //   }
  //   //}
  // },
  methods: {
    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      for (let year = 2023; year <= currentYear; year++) {
        this.years.push({ year });
      }
    },
    async fetchLocatarios () {
        try {
          //if (this.selectedImovelId) {
            const response = await axios.get(`/api/Locador`);
            this.locadoresDisponiveis = response.data.map(locador => ({
              id: locador.id,
              nomeLocador: locador.nome,
              codigoLocador: locador.codigo_cliente
            }));
          //}
        } catch (error) {
          this.handleGlobalError(error, 'Erro ao buscar registro');
        }
    },
    async fetchData() {
      try {
        const params = new URLSearchParams({
          locadorId: this.selectedLocadorId,
          selectedYear: this.selectedYear
        });

        const response = await axios.get(`/api/DemonstrativoAluguel/getItemsView?${params}`);
        const data = response.data;
        this.report = response.data;

        this.rendimentos = data.locatarios.flatMap(locatario => locatario.rendimentos);
        this.deducoes = data.locatarios.flatMap(locatario => locatario.deducoes);
        this.totalRendimentos = data.totalRendimentos;
        this.totalDeducoes = data.totalDeducoes;
      } catch (error) {
        this.showSnackBar('Erro ao buscar dados', 'error');
      }
    },
    formattedRendimentos(rendimentos) {
      return this.formatDataByMonth(rendimentos);
    },
    formattedDeducoes(deducoes) {
      return this.formatDataByMonth(deducoes);
    },
    formattedTotals(totals) {
      return this.formatDataByMonth(totals);
    },
    formatDataByMonth(data) {
      let formatted = {};
      data.forEach(item => {
        if (!formatted[item.descricao]) {
          formatted[item.descricao] = {
            descricao: item.descricao,
            jan: '',
            feb: '',
            mar: '',
            apr: '',
            may: '',
            jun: '',
            jul: '',
            aug: '',
            sep: '',
            oct: '',
            nov: '',
            dec: '',
            total: 0
          };
        }
        formatted[item.descricao][this.getMonthAbbreviation(item.mes)] = this.formatCurrency(item.valor);
        formatted[item.descricao].total += item.valor;
      });
      return Object.values(formatted);
    },
    getMonthAbbreviation(month) {
      const months = {
        "01": "jan",
        "02": "feb",
        "03": "mar",
        "04": "apr",
        "05": "may",
        "06": "jun",
        "07": "jul",
        "08": "aug",
        "09": "sep",
        "10": "oct",
        "11": "nov",
        "12": "dec"
      };
      return months[month];
    },

    async exportToExcel() {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Demonstrativo de Rendimentos');

        // Estilos comuns
        const headerStyle = {
            font: { bold: true },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        const subheaderStyle = {
            font: { bold: true },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        const subheaderLeftStyle = {
            font: { bold: true },
            alignment: { vertical: 'middle', horizontal: 'left' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        const dataStyle = {
            alignment: { vertical: 'middle', horizontal: 'center' },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        // Cabeçalhos principais
        worksheet.mergeCells('A1:N1');
        worksheet.getCell('A1').value = `DEMONSTRATIVO DE RENDIMENTOS ANO ${this.selectedYear}`;
        worksheet.getCell('A1').style = headerStyle;

        worksheet.getColumn('A').width = 25;

        worksheet.mergeCells('A2:N2');
        worksheet.getCell('A2').value = `Locador(a): ${this.report.locadorNome} - CPF/CNPJ: ${this.report.locadorCPF} - PASTA: ${this.report.locadorPasta}`;
        worksheet.getCell('A2').style = dataStyle;

        // Cabeçalhos de meses
        //const headerRow = worksheet.addRow(['Locatários', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total']);
        // headerRow.eachCell((cell) => {
        //     cell.style = headerStyle;
        // });
        const locatarioHeadRow = worksheet.addRow(['Locatários', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total']);
        locatarioHeadRow.eachCell((cell) => {
                cell.style = dataStyle;
            });
            

        // Iterando sobre locatários
        this.report.locatarios.forEach(locatario => {
            const locatarioRow = worksheet.addRow([`Locatário: ${locatario.locatarioNome}`, '', '', '', '', '', '', '', '', '', '', '', '', '']);                        
            locatarioRow.eachCell((cell) => {
                cell.style = subheaderStyle;
            });
            worksheet.mergeCells(`A${worksheet.lastRow.number}:N${worksheet.lastRow.number}`);
            
            const locatariCPFRow = worksheet.addRow([`CPF/CNPJ: ${locatario.locatarioCPF}`, '', '', '', '', '', '', '', '', '', '', '', '', '']);                        
            locatariCPFRow.eachCell((cell) => {
                cell.style = subheaderStyle;
            });
            worksheet.mergeCells(`A${worksheet.lastRow.number}:N${worksheet.lastRow.number}`);

            // Adiciona rendimentos por descrição
            const rendimentosRow = worksheet.addRow([`RENDIMENTOS`, '', '', '', '', '', '', '', '', '', '', '', '', '']);  
            rendimentosRow.eachCell((cell) => {
                cell.style = subheaderLeftStyle;
            });
            worksheet.mergeCells(`A${worksheet.lastRow.number}:N${worksheet.lastRow.number}`);

            const rendimentos = this.formatDataByMonth(locatario.rendimentos);
            rendimentos.forEach(item => {
                const row = worksheet.addRow([
                    item.descricao,
                    item.jan, item.feb, item.mar, item.apr, item.may, item.jun,
                    item.jul, item.aug, item.sep, item.oct, item.nov, item.dec, item.total
                ]);

                row.eachCell((cell) => {
                    cell.style = dataStyle;
                });
            });

            const deducoesRow = worksheet.addRow([`DEDUÇÕES`, '', '', '', '', '', '', '', '', '', '', '', '', '']);  
            deducoesRow.eachCell((cell) => {
                cell.style = subheaderLeftStyle;
            });
            worksheet.mergeCells(`A${worksheet.lastRow.number}:N${worksheet.lastRow.number}`);

            // Adiciona deduções por descrição
            const deducoes = this.formatDataByMonth(locatario.deducoes);
            deducoes.forEach(item => {
                const row = worksheet.addRow([
                    item.descricao,
                    item.jan, item.feb, item.mar, item.apr, item.may, item.jun,
                    item.jul, item.aug, item.sep, item.oct, item.nov, item.dec, item.total
                ]);

                row.eachCell((cell) => {
                    cell.style = dataStyle;
                });
            });

            worksheet.addRow([]);  // Adiciona uma linha vazia após cada locatário
        });

        // Adiciona totais gerais
        const totalRendimentosHeader = worksheet.addRow(['Totais Rendimentos']);
        totalRendimentosHeader.eachCell((cell) => {
            cell.style = subheaderLeftStyle;
        });
        worksheet.mergeCells(`A${worksheet.lastRow.number}:N${worksheet.lastRow.number}`);

        const totalRendimentos = this.formatDataByMonth(this.totalRendimentos);
        totalRendimentos.forEach(item => {
            const row = worksheet.addRow([
                item.descricao,
                item.jan, item.feb, item.mar, item.apr, item.may, item.jun,
                item.jul, item.aug, item.sep, item.oct, item.nov, item.dec, item.total
            ]);

            row.eachCell((cell) => {
                cell.style = dataStyle;
            });
        });

        const totalDeducoesHeader = worksheet.addRow(['Totais Deduções']);
        totalDeducoesHeader.eachCell((cell) => {
            cell.style = subheaderLeftStyle;
        });
        worksheet.mergeCells(`A${worksheet.lastRow.number}:N${worksheet.lastRow.number}`);

        const totalDeducoes = this.formatDataByMonth(this.totalDeducoes);
        totalDeducoes.forEach(item => {
            const row = worksheet.addRow([
                item.descricao,
                item.jan, item.feb, item.mar, item.apr, item.may, item.jun,
                item.jul, item.aug, item.sep, item.oct, item.nov, item.dec, item.total
            ]);

            row.eachCell((cell) => {
                cell.style = dataStyle;
            });
        });

        // Ajusta a largura das colunas
   // Ajusta a largura das colunas restantes
      worksheet.columns.forEach((column, index) => {
            if (index > 0) { // Ajuste a largura de todas as colunas exceto a coluna A
                column.width = 15;
            }
        });

        // Gera o arquivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Demonstrativo_Aluguel_${this.report.locadorNome} .xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSnackBar('Arquivo Excel exportado com sucesso!', 'success');
    } catch (error) {
        console.error("Erro ao exportar para Excel:", error);
        this.showSnackBar('Erro ao exportar para Excel', 'error');
    }
  },
  async exportToPDF() {
    try {
        const doc = new jsPDF('landscape');
        doc.setFontSize(16);

        // Cabeçalho Principal
        doc.text(`DEMONSTRATIVO DE RENDIMENTOS ANO ${this.selectedYear}`, 140, 15, null, null, 'center');

        // Detalhes do Locador
        doc.setFontSize(12);
        doc.text(`Locador(a): ${this.report.locadorNome} - CPF/CNPJ: ${this.report.locadorCPF} - PASTA: ${this.report.locadorPasta}`, 140, 25, null, null, 'center');

        let currentY = 35;

        // Cabeçalho dos meses
        const monthHeaders = ['Descrição', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];

        // Adiciona dados dos locatários
        this.report.locatarios.forEach(locatario => {
            doc.setFontSize(12);
            doc.text(`Locatário: ${locatario.locatarioNome}`, 14, currentY);
            currentY += 6;
            doc.text(`CPF/CNPJ: ${locatario.locatarioCPF}`, 14, currentY);
            currentY += 10;

            // Seção de Rendimentos
            doc.text('RENDIMENTOS', 14, currentY);
            currentY += 3;

            const rendimentos = this.formatDataByMonth(locatario.rendimentos);
            const rendimentosData = rendimentos.map(r => [
                r.descricao,
                r.jan || '', r.feb || '', r.mar || '', r.apr || '', r.may || '', r.jun || '',
                r.jul || '', r.aug || '', r.sep || '', r.oct || '', r.nov || '', r.dec || '',
                this.formatCurrency(r.total)
            ]);

            doc.autoTable({
                startY: currentY,
                head: [monthHeaders],
                body: rendimentosData,
                theme: 'grid',
                styles: { halign: 'center' }
            });

            currentY = doc.previousAutoTable.finalY + 10;

            // Seção de Deduções
            doc.text('DEDUÇÕES', 14, currentY);
            currentY += 3;

            const deducoes = this.formatDataByMonth(locatario.deducoes);
            const deducoesData = deducoes.map(d => [
                d.descricao,
                d.jan || '', d.feb || '', d.mar || '', d.apr || '', d.may || '', d.jun || '',
                d.jul || '', d.aug || '', d.sep || '', d.oct || '', d.nov || '', d.dec || '',
                this.formatCurrency(d.total)
            ]);

            doc.autoTable({
                startY: currentY,
                head: [monthHeaders],
                body: deducoesData,
                theme: 'grid',
                styles: { halign: 'center' }
            });

            currentY = doc.previousAutoTable.finalY + 10;
        });

        // Totais Gerais de Rendimentos
        doc.text('Totais Gerais de Rendimentos:', 14, currentY);
        currentY += 3;

        const totalRendimentosData = this.formatDataByMonth(this.totalRendimentos).map(r => [
            r.descricao,
            r.jan || '', r.feb || '', r.mar || '', r.apr || '', r.may || '', r.jun || '',
            r.jul || '', r.aug || '', r.sep || '', r.oct || '', r.nov || '', r.dec || '',
            this.formatCurrency(r.total)
        ]);

        doc.autoTable({
            startY: currentY,
            head: [monthHeaders],
            body: totalRendimentosData,
            theme: 'grid',
            styles: { halign: 'center' }
        });

        currentY = doc.previousAutoTable.finalY + 10;

        // Totais Gerais de Deduções
        doc.text('Totais Gerais de Deduções:', 14, currentY);
        currentY += 3;

        const totalDeducoesData = this.formatDataByMonth(this.totalDeducoes).map(d => [
            d.descricao,
            d.jan || '', d.feb || '', d.mar || '', d.apr || '', d.may || '', d.jun || '',
            d.jul || '', d.aug || '', d.sep || '', d.oct || '', d.nov || '', d.dec || '',
            this.formatCurrency(d.total)
        ]);

        doc.autoTable({
            startY: currentY,
            head: [monthHeaders],
            body: totalDeducoesData,
            theme: 'grid',
            styles: { halign: 'center' }
        });

        // Salva o PDF
        doc.save(`Demonstrativo_Aluguel_${this.report.locadorNome} .pdf`);
        this.showSnackBar('Arquivo PDF exportado com sucesso!', 'success');
    } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        this.showSnackBar("Erro ao gerar o PDF", "error");
    }
},
    formatCurrency(value) {
      if (value === undefined || value === null) {
        return "R$ 0,00";
      }
      return parseFloat(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
    getMonthName(monthNumber) {
      const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      return months[parseInt(monthNumber) - 1];
    },    
    formatDate (date) {
        return new Date(date).toLocaleDateString('pt-BR');
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
    showSnackBar(message,color)
    {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    errorEvent(message,color) {
      this.showSnackBar(message,color);
    },
  },
};
</script>


<style scoped>
.mt-5 {
  margin-top: 2rem;
}
.my-4 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.5rem;
}
</style>