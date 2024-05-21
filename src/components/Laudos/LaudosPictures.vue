<template>
    <v-container>
      <!-- Row for title and button -->
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <h1 v-if="start">Fotos Início</h1><h1 v-if="!start">Fotos Fim</h1>
          <h4>Selecione até 07 fotos</h4>
        </v-col>
      </v-row>

      <v-file-input
        v-model="files"
        label="Carregar imagens"
        prepend-icon="mdi-camera"
        multiple
        accept="image/*"
        @change="handleFileUpload"
        :disabled="images.length >= 7"
      ></v-file-input>
      <v-row>
        <v-col
          cols="12"
          sm="2"
          v-for="(image, index) in images"
          :key="index"
        >
          <v-img
            :src="image.src"
            height="100"
            aspect-ratio="1"
          ></v-img>
          <v-btn
            icon
            color="red"
            @click="removeImage(image.name, index)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-btn
        color="primary"
        @click="returnLaudos"
      >
        Voltar
      </v-btn>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      start: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        files: [],
        images: []
      };
    },
    mounted() {
      this.fetchImages();
      // console.log('files-length:', this.files.length);
      // console.log('id:', this.id);
    },
    methods: {
     async handleFileUpload() {
        if (!this.files.length) return;

        //substitui imagens
        // this.images = this.files.slice(0, 7).map(file => ({
        //   src: URL.createObjectURL(file),
        //   file,
        //   name: file.name
        // }));
        // Cria miniaturas para os novos arquivos
        const newImages = this.files.map(file => ({
          src: URL.createObjectURL(file),
          file,
          name: file.name
        }));

        // Concatena com as imagens existentes, mantendo o limite de 7
        this.images = [...this.images, ...newImages].slice(0, 7);
        //this.images = this.images.concat(newImages);

        //do upload
        await this.uploadImages();

        //load images from api
        this.fetchImages();

      },
      async uploadImages() {
        const formData = new FormData();
        formData.append('id', this.id);
        formData.append('start', this.start);
        this.images.forEach(({ file }) => formData.append('files', file));
  
        try {
          await axios.post('/api/Laudo/uploadImageLaudo', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          this.files = [];
          this.fetchImages();
        } catch (error) {
          this.$emit('error', error); 
        }
      },
      async fetchImages() {
        try {
          const response = await axios.get(`/api/Laudo/getImages?id=${this.id}&start=${this.start}`);
          this.images = response.data.map(img => ({
            src: img.url,
            name: img.name
          }));
        } catch (error) {
          this.$emit('error', error); 
        }
      },
      async removeImage(imageName, index) {
        try {
          await axios.delete(`/api/Laudo/deleteImage?imageName=${imageName}&id=${this.id}&start=${this.start}`);
          this.images.splice(index, 1);
        } catch (error) {
          this.$emit('error', error); 
        }
      },
      async returnLaudos() {
        try {
          this.$emit('update');
        } catch (error) {
          this.$emit('error', error); 
        }
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  