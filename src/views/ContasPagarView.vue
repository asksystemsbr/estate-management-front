<template>
    <ContasList :titulo="tituloDinamico"/>
  </template>
  
  <script>
  import ContasList from '../components/Contas/ContasList.vue';
  
  export default {
    components: {
      ContasList
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