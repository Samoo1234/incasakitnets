# Como Resolver o Problema de CORS do Firebase Storage

## Problema Identificado
O erro `Access to XMLHttpRequest at ... has been blocked by CORS policy` indica que o Firebase Storage não está configurado para aceitar requisições do domínio localhost:5173.

## Soluções

### 1. Configurar Regras de CORS no Firebase Storage

Execute este comando no terminal (requer Google Cloud SDK):

```bash
gsutil cors set cors.json gs://incasa-319b6.firebasestorage.app
```

Onde `cors.json` contém:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:3000", "https://incasa-319b6.web.app"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
```

### 2. Configurar Arquivo .env do Cliente

Crie o arquivo `client/.env`:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=incasa-319b6.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=incasa-319b6
VITE_FIREBASE_STORAGE_BUCKET=incasa-319b6.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 3. Regras de Segurança do Storage

No Console Firebase > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura e escrita para usuários autenticados
    match /kitnets/{allPaths=**} {
      allow read: if true; // Permitir leitura pública das imagens
      allow write: if request.auth != null; // Apenas usuários autenticados podem fazer upload
    }
  }
}
```

### 4. Solução Temporária Implementada

Por enquanto, o sistema está configurado para:
- Tentar fazer upload da imagem
- Se falhar (CORS), usar uma imagem placeholder
- Continuar funcionando normalmente

## Status Atual

✅ **Sistema Funcionando**: O cadastro de kitnets funciona mesmo sem upload de imagens
✅ **Consulta Implementada**: Home.jsx agora consulta dados reais do Firebase
✅ **Gerenciamento**: Nova página para gerenciar status das kitnets
✅ **Dashboard Dinâmico**: Estatísticas reais do Firebase

## Próximos Passos

1. Configurar CORS no Firebase Storage
2. Adicionar arquivo .env com credenciais reais
3. Testar upload de imagens
4. Deploy para produção 