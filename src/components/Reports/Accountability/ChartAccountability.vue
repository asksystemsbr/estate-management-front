<template>
  <v-container>
    <!-- <v-row align="center" justify="center">
            <v-col cols="12" md="12">
              <v-select
                v-model="selectedImovelId"
                :items="imoveisDisponiveis"
                label="Selecione um Imóvel"
                item-title="codigoImovel"
                item-value="id"
                :error-messages="!validaImovel ? '' : 'Selecione uma imóvel válido'"
              ></v-select>
            </v-col>
     </v-row> -->
     <!-- <v-row  align="center" justify="center">        
      <v-col cols="12" md="12">
        <v-select
            v-model="selectedLocatarioId"
            :items="locatariosDisponiveis"
            label="Selecione um Locatário"
            item-title="nomeLocatario"
            item-value="id"  
        ></v-select>
      </v-col>
      </v-row>        -->
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
    <v-row>
      <v-col>
        <v-text-field
          v-model="startDate"
          label="Data de Início"
          type="date"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="endDate"
          label="Data de Fim"
          type="date"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn color="primary" @click="fetchData" :disabled="!isFormValid">Buscar</v-btn>
      </v-col>
    </v-row>

    <!-- Linha separadora antes do título "Imóveis" -->
    <v-divider class="my-4"></v-divider>

    <!-- Tabela de Imóveis Recebidos -->
    <!-- <h3>Imóveis</h3> -->
    <v-data-table
      :headers="headersReceived"
      :items="receivedItems"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:item="{ item, index }">        
        <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.imovel }}</td>
            <td class="text-left">{{ item.locatario }}</td>
            <td class="text-left">{{ formatDate(item.dtVencimento) }}</td>
            <td class="text-left">{{ formatDate(item.dtPagamento) }}</td>
            <td class="text-left">{{ formatCurrency(item.valorPago) }}</td>            
            <td class="text-left">{{ formatCurrency(item.valorJuros) }}</td>                        
        </tr>
      </template>
    </v-data-table>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <h2>Subtotal Recebido: {{ formatCurrency(reportData.totalPago) }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <br/>
    <br/>
    <!-- Tabela de Adiantamentos -->
    <!-- <h3>Descontos</h3> -->
    <v-data-table
      :headers="headersDiscounts"
      :items="discountItems"
      item-key="id"
      class="elevation-1 mt-5"
    >    
      <template v-slot:item="{ item, index }">        
        <tr :style="{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }">
            <td class="text-left">{{ item.descricao }}</td>       
            <td class="text-left">{{ formatCurrency(item.valor) }}</td>                        
        </tr>        
      </template>
    </v-data-table>
    
    <!-- Totais -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <h2>Subtotal Descontos: {{ formatCurrency(reportData.totalDiscounts) }}</h2>
            <br/>
            <h2>Repasse Proprietário: {{ formatCurrency(reportData.totalRepass) }}</h2>
          </v-card-text>
        </v-card>
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
      // Headers para Imóveis Recebidos
      headersReceived: [
        { title: 'Imóvel', value: 'imovel', sortable: true },
        { title: 'Locatário', value: 'locatario', sortable: true },
        { title: 'Vencimento', value: 'dtVencimento', sortable: true },
        { title: 'Pgto', value: 'dtPagamento', sortable: true },
        { title: 'Valor', value: 'valorPago', sortable: true },
        { title: 'M/J', value: 'valorJuros', sortable: true },
      ],
      // Headers para Adiantamentos
      headersDiscounts: [
        { title: 'Descrição', value: 'descricao', sortable: true },
        { title: 'Valor', value: 'valor', sortable: true },
      ],
      // Dados recebidos do backend
      reportData: {}, // Vai armazenar o `ReportRentPaidViewModel` completo
      receivedItems: [], // Lista de `ReportRentReceivedHouses`
      discountItems: [], // Lista de `ReportRentPaidDicounts`
      startDate: '', // Data de início do filtro
      endDate: '', // Data de fim do filtro
      imoveisDisponiveis: [],
      locadoresDisponiveis: [],
      selectedImovelId: 0,
      selectedLocadorId: 0,
      selectedLocadorName: '',
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
      return this.selectedLocadorId && this.startDate && this.endDate;
    },
    filteredItems() {
        return this.receivedItems;
    },
    filteredPaid() {
        return this.discountItems;
    },
  },  
  created() {
    // Chamada ao backend para obter os dados
    //this.fetchData();
    this.fetchLocatarios();
  },
  watch: {
    async selectedImovelId(newVal) {
      if (newVal) {
        await this.fetchLocatarios();
      }
    }
    // async selectedLocatarioId(newVal) {
    //   if (newVal) {
    //     this.contas.ClienteId = this.selectedLocatarioId;
    //   }
    //}
  },
  methods: {
    async fetchData() {
      try {
        const params = new URLSearchParams();
        if (this.startDate) params.append('StartDate', this.startDate);
        if (this.endDate) params.append('EndDate', this.endDate);
        if (this.selectedLocadorId) params.append('filterId', this.selectedLocadorId);
        //if (this.selectedImovelId) params.append('filterCod', this.selectedImovelId);

        // Supondo que exista uma API que retorne esses dados
        const response = await axios.get(`/api/PrestacaoContas/getItemsView?${params.toString()}`);
        this.reportData = response.data;
        this.receivedItems = this.reportData.homes;
        this.discountItems = this.reportData.discounts;
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        this.handleGlobalError(error, 'Failed to fetch register.');
      }
    },
    async fetchImovel () {
      try {
        const response = await axios.get(`/api/Imovels`);
        this.imoveisDisponiveis = response.data.map(imovel => ({
          id: imovel.id,
          codigoImovel: imovel.codigoImovel,
        }));
      } catch (error) {
        this.handleGlobalError(error, 'Erro ao buscar registro');
      }
    },
    async fetchLocatarios () {
        try {
          //if (this.selectedImovelId) {
            const response = await axios.get(`/api/Locador`);
            this.locadoresDisponiveis = response.data.map(locador => ({
              id: locador.id,
              nomeLocador: locador.nome,
              codigoLocador: locador.codigo_locador
            }));
          //}
        } catch (error) {
          this.handleGlobalError(error, 'Erro ao buscar registro');
        }
    },
    async exportToExcel() {
      try {
        const currentDate = new Date().toLocaleDateString('pt-BR', {
                                                                      day: '2-digit',
                                                                      month: 'long',
                                                                      year: 'numeric'
                                                                    });
        const selected = this.locadoresDisponiveis.find(locador => locador.id === this.selectedLocadorId);
        this.selectedLocadorName = selected ? selected.codigoLocador : '';
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('DE MARCO CORRETORA DE IMÓVEIS');

        // Importar a imagem
        const response = await fetch(require('@/assets/home.jpg'));
        const imageBlob = await response.blob();
        const reader = new FileReader();

        reader.onload = () => {
          const logoImage = reader.result.split(',')[1]; // Remover prefixo data:image/jpeg;base64,
          
          // Adiciona imagem ao Excel
          const imageId = workbook.addImage({
            base64: logoImage,
            extension: 'jpg', // ou 'png', dependendo do formato da imagem
          });
          worksheet.addImage(imageId, 'A1:A5'); // Ajuste o range de células conforme necessário

          // Adiciona cabeçalho da planilha com nome da empresa e logo
          worksheet.mergeCells('B1:F1');
          worksheet.getCell('B1').value = 'DE MARCO CORRETORA DE IMÓVEIS';
          worksheet.getCell('B1').font = { size: 14, bold: true };
          worksheet.getCell('B1').alignment = { horizontal: 'center' };
          
          worksheet.mergeCells('B2:F2');
          worksheet.getCell('B2').value = 'CRECI sp 184.317 - F';
          worksheet.getCell('B2').font = { size: 12 };
          worksheet.getCell('B2').alignment = { horizontal: 'center' };

          worksheet.mergeCells('B5:F5');
          worksheet.getCell('B5').value = this.selectedLocadorName;
          worksheet.getCell('B5').font = { size: 15 };
          worksheet.getCell('B5').alignment = { horizontal: 'center' };
          // Dados de "Imóveis Recebidos"
          worksheet.addRow([]);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          let headerRow = worksheet.addRow(['IMÓVEL', 'LOCATÁRIO', 'VENCTO', 'PGTO', 'VALOR', 'M/J']);
          worksheet.columns = [
            { key: 'imovel', width: 20 },
            { key: 'locatario', width: 20 },
            { key: 'dtVencimento', width: 11 },
            { key: 'dtPagamento', width: 11 },
            { key: 'valorPago', width: 13 },
            { key: 'valorJuros', width: 13 },
          ];
          worksheet.getRow(8).font = { bold: true };
          worksheet.getRow(8).alignment = { horizontal: 'center' };

          // Definindo bordas para a linha do cabeçalho
          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });

          // Adiciona itens recebidos
          this.filteredItems.forEach((received) => {
            headerRow = worksheet.addRow([
              received.imovel,
              received.locatario,
              this.formatDate(received.dtVencimento),
              this.formatDate(received.dtPagamento),
              this.formatCurrency(received.valorPago),
              this.formatCurrency(received.valorJuros)
            ]);
            
            // Definindo bordas para a linha
            headerRow.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });

          // Formatação de subtotal
          const lastRow = worksheet.lastRow;
          // headerRow = worksheet.addRow([]);
          // worksheet.mergeCells(`A${lastRow.number+1}:F${lastRow.number+1}`);
          //   // Definindo bordas para a linha
          //   headerRow.eachCell((cell) => {
          //     cell.border = {
          //       top: { style: 'thin' },
          //       left: { style: 'thin' },
          //       bottom: { style: 'thin' },
          //       right: { style: 'thin' }
          //     };
          //   });  

          headerRow =worksheet.addRow(['Subtotal Recebido', '', '', '', this.formatCurrency(this.reportData.totalPago), this.formatCurrency(this.reportData.totalMultaJuros)]);          
          worksheet.mergeCells(`A${lastRow.number + 1}:D${lastRow.number + 1}`);
          worksheet.getCell(`A${lastRow.number + 1}`).alignment = { horizontal: 'left' };
          worksheet.getCell(`A${lastRow.number + 1}`).font = { bold: true };
          worksheet.getCell(`E${lastRow.number + 1}`).font = { bold: true };
          worksheet.getCell(`F${lastRow.number + 1}`).font = { bold: true };
          // Definindo bordas para a linha
          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });

          // Dados de "Descontos"
         worksheet.addRow([]);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
         
          //worksheet.addRow(['DESCRIÇÃO', 'VALOR']);
          //worksheet.getRow(worksheet.lastRow.number).font = { bold: true };
          //worksheet.getRow(worksheet.lastRow.number).alignment = { horizontal: 'center' };
          this.filteredPaid.forEach((paid) => {
            headerRow = worksheet.addRow([paid.descricao,'','','','', this.formatCurrency(paid.valor)]);
            worksheet.mergeCells(`A${worksheet.lastRow.number}:E${worksheet.lastRow.number}`);
            // Definindo bordas para a linha
            headerRow.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });            
          });
          

          // Subtotal de descontos e repasse ao proprietário
          // headerRow = worksheet.addRow([]);
          // worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          // // Definindo bordas para a linha
          // headerRow.eachCell((cell) => {
          //   cell.border = {
          //     top: { style: 'thin' },
          //     left: { style: 'thin' },
          //     bottom: { style: 'thin' },
          //     right: { style: 'thin' }
          //   };
          // });

          headerRow = worksheet.addRow(['SubTotal Descontos', '', '', '', '', this.formatCurrency(this.reportData.totalDiscounts)]);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:E${worksheet.lastRow.number}`);
          worksheet.getCell(`A${worksheet.lastRow.number}`).alignment = { horizontal: 'left' };
          worksheet.getCell(`A${worksheet.lastRow.number}`).font = { bold: true };
          worksheet.getCell(`F${worksheet.lastRow.number}`).font = { bold: true };
          // Definindo bordas para a linha
          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });          
          headerRow = worksheet.addRow([]);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          // Definindo bordas para a linha
          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });          

          headerRow = worksheet.addRow(['Repasses proprietário', '', '', '', '', this.formatCurrency(this.reportData.totalRepass)]);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:E${worksheet.lastRow.number}`);
          worksheet.getCell(`A${worksheet.lastRow.number}`).alignment = { horizontal: 'left' };
          worksheet.getCell(`A${worksheet.lastRow.number}`).font = { bold: true };
          worksheet.getCell(`F${worksheet.lastRow.number}`).font = { bold: true };
          // Definindo bordas para a linha
          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });          

          worksheet.addRow(['Recebi as quantias supracitadas, estando ciente dos descontos efetuados, os quais foram'
          , '', '', '', '', '']);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          worksheet.getCell(`A${worksheet.lastRow.number}`).alignment = { horizontal: 'center' };
          worksheet.addRow(['previamente  convencionados:'
          , '', '', '', '', '']);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          worksheet.getCell(`A${worksheet.lastRow.number}`).alignment = { horizontal: 'center' };
          worksheet.addRow([]);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          worksheet.addRow([`Araçariguama, ${currentDate}`, '', '', '', '', '']);
          worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`);
          worksheet.getCell(`A${worksheet.lastRow.number}`).alignment = { horizontal: 'center' };

          // Salvando o arquivo
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `prestacao_contas_proprietarios_${this.selectedLocadorName}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        };

        reader.readAsDataURL(imageBlob);
        }catch (error) {
        console.error("Erro ao gerar o Excel:", error);
        this.showSnackBar("Erro ao gerar o Excel", "error");
      }
    },
    async exportToPDF() {
      try {
            const doc = new jsPDF('landscape'); // Orientação da página em paisagem
            const currentDate = new Date().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });

            // Cabeçalho da Empresa
            doc.setFontSize(16);
            doc.text('DE MARCO CORRETORA DE IMÓVEIS', 140, 15, null, null, 'center');
            doc.setFontSize(12);
            doc.text('CRECI sp 184.317 - F', 140, 23, null, null, 'center');
            
            // Nome do Locatário Selecionado
            const selected = this.locadoresDisponiveis.find(locador => locador.id === this.selectedLocadorId);
            this.selectedLocadorName = selected ? selected.codigoLocador : '';
            doc.setFontSize(14);
            doc.text(`Locador: ${this.selectedLocadorName}`, 140, 35, null, null, 'center');

            // Tabela de Imóveis Recebidos
            const headersReceived = [['IMÓVEL', 'LOCATÁRIO', 'VENCTO', 'PGTO', 'VALOR', 'M/J']];
            const dataReceived = this.receivedItems.map(item => [
              item.imovel,
              item.locatario,
              this.formatDate(item.dtVencimento),
              this.formatDate(item.dtPagamento),
              this.formatCurrency(item.valorPago),
              this.formatCurrency(item.valorJuros)
            ]);

            doc.autoTable({
              startY: 45,
              head: headersReceived,
              body: dataReceived,
              theme: 'grid',
              headStyles: { fillColor: [41, 128, 185], textColor: 255 },
              bodyStyles: { fillColor: [240, 240, 240], textColor: 0 },
              alternateRowStyles: { fillColor: [255, 255, 255] },
            });

            // Subtotal Recebido
            const finalYReceived = doc.previousAutoTable.finalY;
            doc.setFontSize(12);
            doc.text(`Subtotal Recebido: ${this.formatCurrency(this.reportData.totalPago)}`, 200, finalYReceived + 10);

            // Tabela de Descontos
            const headersDiscounts = [['DESCRIÇÃO', 'VALOR']];
            const dataDiscounts = this.discountItems.map(item => [
              item.descricao,
              this.formatCurrency(item.valor)
            ]);

            doc.autoTable({
              startY: finalYReceived + 20,
              head: headersDiscounts,
              body: dataDiscounts,
              theme: 'grid',
              headStyles: { fillColor: [41, 128, 185], textColor: 255 },
              bodyStyles: { fillColor: [240, 240, 240], textColor: 0 },
              alternateRowStyles: { fillColor: [255, 255, 255] },
            });

            // Subtotais e Repasse ao Proprietário
            const finalYDiscounts = doc.previousAutoTable.finalY;
            doc.text(`Subtotal Descontos: ${this.formatCurrency(this.reportData.totalDiscounts)}`, 200, finalYDiscounts + 10);
            doc.text(`Repasse Proprietário: ${this.formatCurrency(this.reportData.totalRepass)}`, 200, finalYDiscounts + 20);

            // Texto Final e Data
            doc.setFontSize(10);
            doc.text('Recebi as quantias supracitadas, estando ciente dos descontos efetuados, os quais foram previamente convencionados:', 140, finalYDiscounts + 30, null, null, 'center');
            doc.text(`Araçariguama, ${currentDate}`, 140, finalYDiscounts + 40, null, null, 'center');

            // Salvar o PDF
            doc.save(`prestacao_contas_proprietario_${this.selectedLocadorName}.pdf`);
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

<style>
.mt-5 {
  margin-top: 2rem;
}
.my-4 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.5rem; /* Ajuste de tamanho de fonte para subtotais */
}
</style>