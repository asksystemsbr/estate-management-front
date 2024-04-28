export default {
    methods: {
      handleGlobalError(error, customMessage = '') {
        console.error('Global Error Handler:', error);
  
        let message = 'An unexpected error occurred.';
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          console.error('Detailed error:', error.response);
          if (error.response.status === 403) {
            message = 'Acesso negado. Você não tem permissão para essa ação.';
            //message = 'Access denied. You do not have permission to perform this action.';
          } else if (error.response.status === 404) {
            message = 'End point não encontrado.';
            //message = 'The requested resource was not found.';
          } else {
            message = customMessage || error.response.statusText || message;
          }
        } else if (error.request) {
          // The request was made but no response was received
          message = 'Sem resposta do servidor. por favor cheque sua conexão de internet.';
        //   message = 'No response from the server. Please check your network connection.';
        } else {
          // Something else caused the error
          message = customMessage || message;
        }
  
        //this.$emit('errorEvent', { message: message, color: 'error' });
          // Directly invoke errorEvent if in the same component
        this.errorEvent(message, 'error');
      }
    }
  }
  