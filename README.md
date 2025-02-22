# Incasa - Sistema de Gestão Inteligente de Kitnets

## Visão Geral
Incasa é uma plataforma centralizada para gestão inteligente de kitnets, oferecendo uma experiência moderna e automatizada tanto para hóspedes quanto para administradores.

## Requisitos do Sistema

### Ambiente de Desenvolvimento
- Node.js 16.x ou superior
- NPM 7.x ou superior
- Git
- Docker e Docker Compose
- Firebase CLI
- React Native CLI (para desenvolvimento mobile)

### Hardware Recomendado
- Processador: Intel Core i5/AMD Ryzen 5 ou superior
- Memória RAM: 8GB mínimo (16GB recomendado)
- Armazenamento: SSD com 256GB ou mais

## Status de Implementação

### Recursos Implementados ✅

#### 1. Autenticação e Segurança
- Sistema de autenticação com Firebase
- Proteção de rotas com autenticação
- Rate limiting implementado
- Configurações de segurança básicas (Helmet, CORS)

#### 2. Interface do Usuário
- Layout responsivo com Material-UI
- Carregamento lazy de componentes para melhor performance
- Páginas básicas implementadas:
  - Login
  - Registro
  - Dashboard
  - Home
  - Perfil
  - Cadastro de Kitnet
  - Formulário de Aluguel

#### 3. Backend
- Servidor Express.js configurado
- Integração com Firebase (Auth, Firestore, Storage, Analytics)
- API RESTful básica
- Configuração de variáveis de ambiente

### Recursos em Desenvolvimento 🚧

#### 1. Plataforma Centralizada
- Integração com Tuya Smart (Planejado)
- Sistema de gestão hoteleira
- Gerenciamento de reservas

#### 2. Sistema de Pagamento
- Integração com gateways de pagamento
- Sistema de gestão financeira
- Relatórios financeiros

#### 3. Controle de Acesso
- Geração de senhas únicas
- Sistema de envio de emails
- Integração com fechaduras inteligentes

#### 4. Automação e IoT
- Controle de acesso biométrico
- Integração com assistentes virtuais
- Sistema de monitoramento remoto

#### 5. Recursos Avançados
- Sistema de backup
- Monitoramento em tempo real
- Autenticação de dois fatores

## Arquitetura do Sistema

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Frontend Web    |     |  Frontend Mobile |     |   Admin Panel   |
|  (React.js)      |<--->|  (React Native)  |<--->|   (React.js)    |
|                  |     |                  |     |                  |
+--------^---------+     +--------^---------+     +--------^---------+
         |                       |                        |
         |                       |                        |
+--------v-----------------------v------------------------v---------+
|                                                                  |
|                          API Gateway                            |
|                         (Express.js)                            |
|                                                                  |
+--------^-----------------------^------------------------^---------+
         |                       |                        |
+--------v----------+  +---------v----------+  +---------v----------+
|                   |  |                    |  |                    |
|   Firebase        |  |   Tuya Smart       |  |   Payment Gateway  |
|   Services        |  |   Integration      |  |   Integration      |
|                   |  |                    |  |                    |
+-------------------+  +--------------------+  +--------------------+
```

## Stack Tecnológica

### Backend
- Node.js com Express.js para o servidor principal
- APIs RESTful para comunicação com o frontend
- WebSocket para comunicação em tempo real
- Integração com Firebase para autenticação e banco de dados
- Sistema de cache com Redis para melhor performance
- Swagger para documentação da API

### Frontend
- React.js para web dashboard com gerenciamento de estado avançado
- React Native para aplicativo móvel multiplataforma (iOS e Android)
- Material-UI para interface consistente e responsiva
- Redux para gerenciamento de estado global
- React Router para navegação web
- React Navigation para navegação mobile
- Styled Components para estilização avançada
- Jest e React Testing Library para testes

### Banco de Dados
- Firebase Realtime Database para dados em tempo real
- Cloud Firestore para dados estruturados
- Firebase Authentication para gestão de usuários
- Firebase Cloud Storage para armazenamento de arquivos

### Cloud e Infraestrutura
- AWS/Google Cloud Platform
- Docker para containerização
- CI/CD para deploy automático

### IoT e Integração
- Plataforma Tuya Smart
- Protocolo MQTT
- APIs de terceiros para pagamentos e serviços

## Configuração do Ambiente

### 1. Firebase Setup

```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Faça login no Firebase
firebase login

# Inicialize o projeto Firebase
firebase init

# Selecione os serviços necessários:
# - Authentication
# - Firestore
# - Storage
# - Functions
```

### 2. Tuya Smart Setup

1. Crie uma conta em [Tuya IoT Platform](https://iot.tuya.com/)
2. Crie um novo projeto e obtenha as credenciais:
   - Client ID
   - Client Secret
   - Device ID

3. Configure as variáveis de ambiente:
```bash
TUYA_CLIENT_ID=seu_client_id
TUYA_CLIENT_SECRET=seu_client_secret
TUYA_DEVICE_ID=seu_device_id
```

## Instalação e Configuração

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/incasa.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## Boas Práticas de Desenvolvimento

### Padrões de Código
- Utilize ESLint e Prettier para formatação consistente
- Siga o padrão de commits do Conventional Commits
- Mantenha a cobertura de testes acima de 80%
- Documente todas as APIs usando Swagger

### Segurança
- Nunca commit credenciais ou arquivos .env
- Implemente rate limiting em todas as APIs
- Use HTTPS em todos os endpoints
- Mantenha as dependências atualizadas

### Performance
- Implemente lazy loading para componentes pesados
- Utilize caching adequadamente
- Otimize imagens e assets
- Monitore o tempo de resposta das APIs

## Solução de Problemas

### Problemas Comuns

1. **Erro de Conexão com Firebase**
   - Verifique as credenciais no arquivo .env
   - Confirme se o projeto está inicializado corretamente
   - Verifique as regras de segurança do Firebase

2. **Falha na Integração com Tuya**
   - Confirme se as credenciais da Tuya estão corretas
   - Verifique se o dispositivo está online
   - Valide a conexão com a rede

3. **Erros de Build**
   - Limpe a cache do npm: `npm cache clean --force`
   - Remova node_modules e reinstale: `rm -rf node_modules && npm install`
   - Verifique compatibilidade de versões no package.json

## Contribuição
Contribuições são bem-vindas! Por favor, leia nosso guia de contribuição antes de submeter pull requests.

## Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE.md para detalhes.

## Suporte
Para suporte técnico, entre em contato através do email: suporte@incasa.com.br