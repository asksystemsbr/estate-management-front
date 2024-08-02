<template>
    <ChartPayment :titulo="tituloDinamico"/>
  </template>
  
  <script>
  import ChartPayment from '../../components/Reports/ChartAccount/ChartPayment.vue';
  
  export default {
    components: {
      ChartPayment
    },
    data() {
      return {
        tituloDinamico: 'PAGAR'
      };
    }
  };
  </script>
  
  <style>
  /* Estilos opcionais personalizados */
  </style>