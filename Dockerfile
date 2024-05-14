# Defina a imagem base
FROM node:16

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o arquivo package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos locais para o contêiner
COPY . .

# Constrói a aplicação para produção
RUN npm run build

# Instala um servidor HTTP simples para servir o conteúdo estático
RUN npm install -g http-server

# Abre a porta 8080 para acesso ao contêiner
EXPOSE 8080

# Executa o servidor HTTP, servindo o diretório de build
CMD [ "http-server", "dist" ]