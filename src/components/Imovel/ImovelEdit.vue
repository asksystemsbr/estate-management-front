<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Novo Imóvel</h1>
        <v-form @submit.prevent="updateImovel" ref="form">

          <v-text-field
            v-model="imovel.codigoImovel"
            label="Cód. Imóvel"
            required
          ></v-text-field>

          <br>
          <h2>Locatários</h2>
          <br>
          <v-row>
            <v-col cols="12" sm="12" v-for="(locatario, index) in locatarios" :key="index">
              <v-row>
                <v-col cols="11" sm="11" >
                    <v-select
                      v-model="locatario.id"
                      :items="clienteCadastrado"
                      item-title="nome"
                      item-value="id"
                      label="Locatario"
                    ></v-select>
              </v-col>
              <v-col cols="1" sm="1" >              
                  <v-btn icon @click="removeLocatario(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
              </v-col>
              </v-row>
            </v-col>
            <v-btn @click="addLocatario">Adicionar Locatário</v-btn>
          </v-row>
          <br>

          <br>
          <h2>Locadores</h2>
          <br>
          <v-row>
            <v-col cols="12" sm="12" v-for="(locador, index) in locadores" :key="index">
              <v-row>
                <v-col cols="11" sm="11" >
                    <v-select
                      v-model="locador.id"
                      :items="locadorCadastrado"
                      item-title="nome"
                      item-value="id"
                      label="Locador"
                    ></v-select>
              </v-col>
              <v-col cols="1" sm="1" >              
                  <v-btn icon @click="removeLocador(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
              </v-col>
              </v-row>
            </v-col>
            <v-btn @click="addLocador">Adicionar Locador</v-btn>
          </v-row>
          <br>

          <!-- <v-select
                v-model="imovel.locadorId"
                :items="locadorCadastrado"
                item-title="nome"
                item-value="id"
                label="Locador"
                required
            ></v-select>   -->

          <v-text-field
            v-model="imovel.logradouro"
            label="Logradouro"
            required
          ></v-text-field>

          <v-text-field
            v-model="imovel.numero"
            label="Número"
            required
          ></v-text-field>

          <v-text-field
            v-model="imovel.complemento"
            label="Complemento"
          ></v-text-field>

          <v-text-field
            v-model="imovel.cep"
            label="CEP"
            required
            @input="formatCep"
          ></v-text-field>

          <v-text-field
            v-model="imovel.bairro"
            label="Bairro"
            required
          ></v-text-field>

          <v-text-field
            v-model="imovel.cidade"
            label="Cidade"
            required
          ></v-text-field>

          <v-text-field
            v-model="imovel.uf"
            label="UF"
            required
            maxlength="2"
          ></v-text-field>

          <v-text-field
            v-model="imovel.valor"
            label="Valor"
            required
            type="number"
          ></v-text-field>

          <v-text-field
            v-model="imovel.diaVencimento"
            label="Vencimento"
            required
            type="number"
          ></v-text-field>

          <v-text-field
            v-model="imovel.finalidade"
            label="Finalidade"
            required
          ></v-text-field>
      <v-menu
          ref="menu"
          v-model="menuOpendtEntrada"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
      >
          <template v-slot:activator="{  attrs }">
            <v-text-field
              v-model="formattedDateDtEntrada"
              label="Data de Entrada"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              @click="menuOpendtEntrada = true"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="imovel.dataEntrada"
            @input="handleDateChangeDataEntrada"
            @update:modelValue ="handleDateChangeDataEntrada"
            no-title
          ></v-date-picker>
      </v-menu>

      <v-menu
          ref="menu"
          v-model="menuOpen"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
      >
          <template v-slot:activator="{ on, attrs }">
            {{ console.log('Activator on:', on) }}
            <v-text-field
              v-model="formattedDate"
              label="Data de Vencimento"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              @click="() => customClickHandler()" 
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="imovel.dataVencimento"
            @input="handleDateChange"
            @update:modelValue ="handleDateChange"
            no-title
          ></v-date-picker>
      </v-menu>

          <v-text-field
            v-model="imovel.reajuste"
            label="Reajuste"
            type="number"
          ></v-text-field>

          <v-textarea
            v-model="imovel.obs"
            label="Observações"
          ></v-textarea>

        <v-select
              v-model="imovel.situacaoId"
              :items="situacoesCliente"
              item-title="descricao"
              item-value="id"
              label="Situação do Imóvel"
              required
        ></v-select>  

        <v-text-field
            v-model="imovel.valor_caucao"
            label="Valor Caução"
            type="number"
        ></v-text-field>

        <v-checkbox
          v-model="imovel.semSeguro"
          label="Sem Seguro"
          :true-value="'1'"
          :false-value="'0'"
        ></v-checkbox>
        <br>
        <h2>Fiadores</h2>
        <br>
        <v-row>
          <v-col cols="12" sm="12" v-for="(fiador, index) in fiadores" :key="index">
            <v-row>
              <v-col cols="11" sm="11" >
                  <v-select
                    v-model="fiador.id"
                    :items="fiadorCadastrado"
                    item-title="nome"
                    item-value="id"
                    label="Fiador"
                  ></v-select>
             </v-col>
             <v-col cols="1" sm="1" >              
                <v-btn icon @click="removeFiador(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
            </v-row>
          </v-col>
          <v-btn @click="addFiador">Adicionar Fiador</v-btn>
        </v-row>
        <br>
          <h2>Seguro</h2>
          <v-text-field
              v-model="imovel.seguroFianca"
              label="Seguro Fiança (Empresa)"
            ></v-text-field>

          <v-text-field
            v-model="imovel.modalidadeSeguro"
            label="Modalidade Seguro"
          ></v-text-field>

          <v-text-field
            v-model="imovel.ramoSeguro"
            label="Ramo Seguro"
          ></v-text-field>

          <v-text-field
            v-model="imovel.numeroApolice"
            label="Nº Apólice"
          ></v-text-field>

          <v-menu
            ref="menu"
            v-model="menuOpenStartInsure"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
        >
            <template v-slot:activator="{  attrs }">
              <v-text-field
                v-model="formattedDateStartInsure"
                label="Data Início Seguro"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                @click="menuOpenStartInsure = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="imovel.dataInicioSeguro"
              @input="handleDateChangeStartInsure"
              @update:modelValue ="handleDateChangeStartInsure"
              no-title
            ></v-date-picker>
        </v-menu>

        <v-menu
          ref="menu"
          v-model="menuHoraInicioSeguroOpen"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{  attrs }">
            <v-text-field
              v-model="imovel.horaInicioSeguro"
              label="Hora Início Seguro"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              @click="menuHoraInicioSeguroOpen = true"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="imovel.horaInicioSeguro"
            format="24hr"
          ></v-time-picker>
        </v-menu>


        <v-menu
            ref="menu"
            v-model="menuOpenEndInsure"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
        >
            <template v-slot:activator="{  attrs }">
              <v-text-field
                v-model="formattedDateEndInsure"
                label="Data de Vencimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                @click="menuOpenEndInsure = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="imovel.dataFimSeguro"
              @input="handleDateChangeEndInsure"
              @update:modelValue ="handleDateChangeEndInsure"
              no-title
            ></v-date-picker>
        </v-menu>

        <v-btn
            color="primary"
            class="mr-4"
            type="submit"
          >
            Salvar
          </v-btn>
  
            <v-btn
              color="secondary"
              @click="closeModal"
            >
              Voltar
            </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

  
  <script>
  import { ref,onMounted,nextTick,computed  } from 'vue';
  import axios from 'axios';
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  
  import { imovel, clearImovel } from '@/model/imovel.js';
  
  export default {
    props: {
        id: {
      type: Number,
      required: true
    }
  },
  components: {
    VTimePicker,
  },
    setup(props,{ emit }) {
      const form = ref(null);
      const situacoesCliente=ref([]);
      const clienteCadastrado=ref([]);
      const fiadorCadastrado=ref([]);
      const locadorCadastrado=ref([]);      
      const menuOpen  = ref(false);
      const menuOpenStartInsure  = ref(false);
      const menuOpenEndInsure  = ref(false);
      const menuOpendtEntrada  = ref(false);
      const menuHoraInicioSeguroOpen  = ref(false);
      const fiadores=ref([]);
      const locadores=ref([]);
      const locatarios=ref([]);

      const fetchImovel = async () => {
      try {
        await fetchSituacaoCliente();
        //console.log('Situações Cliente:', situacoesCliente.value);
        await fetchCliente();
        await fetchFiador();
        await fetchLocador();
        //console.log('Cliente:', clienteCadastrado.value);
        const response = await axios.get(`/api/Imovels/${props.id}`);
        console.log('Dados do imovel Recebidos:', response.data);
        imovel.value = response.data;

        await nextTick(); // Aguarda a atualização do DOM
        imovel.value.situacaoId = response.data.situacaoId;
        //imovel.value.clienteId = response.data.clienteId;
        //imovel.value.fiadorId = response.data.fiadorId;
        //imovel.value.locadorId = response.data.locadorId;
        imovel.value.dataVencimento =new Date(response.data.dataVencimento);
        //console.log ('Imovel data vencimento:', imovel.value.dataVencimento);
        //console.log('ID Situação Cliente:', response.data.iD_SITUACAO_CLIENTE);

        //get fiadores by imovel
        const responseFiador = await axios.get(`/api/Imovels/getimovelfiador/${props.id}`);
          fiadores.value = responseFiador.data.map(fiador => ({
          id: fiador.id,
          descricao: fiador.nome
        }));

        const responseLocador = await axios.get(`/api/Imovels/getimovellocador/${props.id}`);
        locadores.value = responseLocador.data.map(locador => ({
          id: locador.id,
          descricao: locador.nome
        }));

        const responseLocatario = await axios.get(`/api/Imovels/getimovelcliente/${props.id}`);
        locatarios.value = responseLocatario.data.map(locatario => ({
          id: locatario.id,
          descricao: locatario.nome
        }));
      } catch (error) {
        emit('error', error); 
      }
    };

    const updateImovel = async () => {
      try {
        imovel.value.horaInicioSeguro = formatHoraInicioSeguro(imovel.value.horaInicioSeguro);
        console.log('Imovel' ,imovel.value);
        await axios.put(`/api/Imovels/${imovel.value.id}`, imovel.value);        
        if (Array.isArray(fiadores.value) && fiadores.value.length > 0) {
            //delete fiador
            await axios.delete(`/api/Imovels/deleteimovelfiador/${imovel.value.id}`);    
          // Percorrer fiadores
              for (const fiador of fiadores.value) {
                const imovelFiador = {
                  id:0,
                  imovelId: imovel.value.id,
                  fiadorId: fiador.id
                };
                // Enviar cada associação para o servidor
                await axios.post('/api/Imovels/imovelfiador', imovelFiador);                
              }
            }

          if (Array.isArray(locatarios.value) && locatarios.value.length > 0) {
            await axios.delete(`/api/Imovels/deleteimovelcliente/${imovel.value.id}`);    
              for (const locatario of locatarios.value) {
                const ImovelCliente = {
                  id:0,
                  imovelId: imovel.value.id,
                  clienteId: locatario.id
                };
                // Enviar cada associação para o servidor
                await axios.post('/api/Imovels/imovelcliente', ImovelCliente);                
              }
            }

          if (Array.isArray(locadores.value) && locadores.value.length > 0) {
            await axios.delete(`/api/Imovels/deleteimovellocador/${imovel.value.id}`);    
              for (const locador of locadores.value) {
                const ImovelLocador = {
                  id:0,
                  imovelId: imovel.value.id,
                  locadorId: locador.id
                };
                // Enviar cada associação para o servidor
                await axios.post('/api/Imovels/imovellocador', ImovelLocador);                
              }
            }
        clearImovel();
        emit('update');
      } catch (error) {
        emit('error', error); 
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchImovel);     

      const fetchSituacaoCliente =async () => {
      try {
        const response = await axios.get(`/api/SituacaoImovel`);
        situacoesCliente.value = response.data.map(situacao => ({
        id: situacao.id,
        descricao: situacao.descricao
    }));
      } catch (error) {
        emit('error', error); 
      }
    };
    const fetchCliente =async () => {
      try {
        const response = await axios.get(`/api/Cliente`);
        clienteCadastrado.value = response.data.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome
        }));
      } catch (error) {
        emit('error', error); 
      }
    };
    const fetchFiador =async () => {
      try {
            const response = await axios.get(`/api/Fiador`);
            fiadorCadastrado.value = response.data.map(fiador => ({
            id: fiador.id,
            nome: fiador.nome
        }));

      } catch (error) {
        emit('error', error);
      }
    };

    const fetchLocador =async () => {
      try {
            const response = await axios.get(`/api/Locador`);
            locadorCadastrado.value = response.data.map(locador => ({
            id: locador.id,
            nome: locador.nome
        }));

      } catch (error) {
        emit('error', error);
      }
    };


        const formatCep = () => {
            let value = imovel.value.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            imovel.value.cep = value;
        };
        
        const formattedDate = computed(() => {
          const date = new Date(imovel.value.dataVencimento);
          return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString('pt-BR')
            : '';
        });

        const formattedDateStartInsure = computed(() => {
          return imovel.value.dataInicioSeguro
              ? new Date(imovel.value.dataInicioSeguro).toLocaleDateString('pt-BR')
              : '';
        });

        const formattedDateEndInsure = computed(() => {
          return imovel.value.dataFimSeguro
              ? new Date(imovel.value.dataFimSeguro).toLocaleDateString('pt-BR')
              : '';
        });

        const formattedDateDtEntrada = computed(() => {
          return imovel.value.dataEntrada
              ? new Date(imovel.value.dataEntrada).toLocaleDateString('pt-BR')
              : '';
        });        

      const customClickHandler = () => {
        menuOpen.value = true;
        // if (on && on.click) {
        //   on.click();  // Ensures that the function exists before calling it
        //}
      };
      const handleOn = (on) => {
        console.log('My on:', on); // Logs the object to the console
        return on; // Returns the object so it can still be used in the template
    };

    const addFiador = () => {
      fiadores.value.push({ id: null });
    };

    const removeFiador = (index) => {
      fiadores.value.splice(index, 1);
    };

    const addLocador = () => {
      locadores.value.push({ id: null });
    };

    const removeLocador = (index) => {
      locadores.value.splice(index, 1);
    };
    
    const addLocatario = () => {
      locatarios.value.push({ id: null });
    };

    const removeLocatario = (index) => {
      locatarios.value.splice(index, 1);
    };    
       function handleDateChange(value) {
          // Check if value is already a Date object
          if (!(value instanceof Date)) {
            value = new Date(value);
            if (isNaN(value.getDate())) {
              console.error('Invalid date received:', value);
              return; // Early return if date is still invalid
            }
          }
          imovel.value.dataVencimento = value;
          menuOpen.value = false;  // Close the menu after selecting the date
        }

      function handleDateChangeStartInsure(value) {
          imovel.value.dataInicioSeguro = value;
          menuOpenStartInsure.value = false;  // Fecha o menu após selecionar a data
      }

      function handleDateChangeEndInsure(value) {
          imovel.value.dataFimSeguro = value;
          menuOpenEndInsure.value = false;  // Fecha o menu após selecionar a data
      }
      function handleDateChangeDataEntrada(value) {
          imovel.value.dataEntrada = value;
          menuOpendtEntrada.value = false;  // Fecha o menu após selecionar a data
      }

      function handleTimeChange(value) {
          imovel.value.horaInicioSeguro = value;
          menuHoraInicioSeguroOpen.value = false;  // Fecha o menu após selecionar a data
      }
      function formatHoraInicioSeguro(hora) {
        if (!hora) return '00:00:00'; // Retorna um valor padrão se nenhuma hora for fornecida

        // Verifica se a hora já está no formato esperado, se estiver, retorna como está
        if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) return hora;

        // Adiciona ":00" aos minutos para formatar como hora completa com segundos
        return `${hora}:00`;
      }

      return {
        imovel,
        clearImovel,
        fetchImovel,
        updateImovel,
        closeModal,
        form,
        formatCep,
        fetchSituacaoCliente,
        situacoesCliente,
        clienteCadastrado,
        fiadorCadastrado,
        locadorCadastrado,
        formattedDate,
        menuOpen,
        menuOpendtEntrada,
      menuOpenStartInsure,
      menuOpenEndInsure,
      menuHoraInicioSeguroOpen,
        handleDateChange,
        customClickHandler,
        handleOn,
        addFiador,
        removeFiador,
        addLocador,
        removeLocador,
        addLocatario,
        removeLocatario,
        formattedDateStartInsure,
        handleDateChangeStartInsure,
        formattedDateEndInsure,
        handleDateChangeEndInsure,
        formattedDateDtEntrada,
        handleDateChangeDataEntrada,
        handleTimeChange,
        fiadores,
        locadores,
        locatarios,
        formatHoraInicioSeguro
      };
    }
  };
  </script>
  