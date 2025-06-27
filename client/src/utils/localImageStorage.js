// Utilitário para armazenamento local de imagens
// Funciona até resolver o problema do Firebase Storage

class LocalImageStorage {
  constructor() {
    this.dbName = 'IncasaImagesDB';
    this.dbVersion = 1;
    this.storeName = 'images';
    this.db = null;
  }

  // Inicializar IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Converter arquivo para base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Redimensionar imagem para economizar espaço
  async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para blob
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Salvar imagem localmente
  async saveImage(file) {
    try {
      if (!this.db) await this.init();
      
      // Redimensionar imagem
      const resizedBlob = await this.resizeImage(file);
      
      // Converter para base64
      const base64 = await this.fileToBase64(resizedBlob);
      
      // Gerar ID único
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Criar objeto para salvar
      const imageData = {
        id: imageId,
        name: file.name,
        type: resizedBlob.type,
        size: resizedBlob.size,
        base64: base64,
        timestamp: new Date(),
        originalSize: file.size
      };
      
      // Salvar no IndexedDB
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await store.add(imageData);
      
      // Retornar URL para usar no sistema
      return {
        id: imageId,
        url: base64,
        size: resizedBlob.size,
        originalSize: file.size
      };
      
    } catch (error) {
      console.error('Erro ao salvar imagem localmente:', error);
      throw error;
    }
  }

  // Recuperar imagem
  async getImage(imageId) {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(imageId);
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.base64);
          } else {
            reject(new Error('Imagem não encontrada'));
          }
        };
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Erro ao recuperar imagem:', error);
      throw error;
    }
  }

  // Listar todas as imagens
  async getAllImages() {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      return [];
    }
  }

  // Deletar imagem
  async deleteImage(imageId) {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await store.delete(imageId);
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }
  }

  // Limpar todas as imagens (útil para manutenção)
  async clearAll() {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await store.clear();
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar imagens:', error);
      return false;
    }
  }

  // Verificar espaço usado
  async getStorageInfo() {
    try {
      const images = await this.getAllImages();
      const totalSize = images.reduce((acc, img) => acc + (img.size || 0), 0);
      const count = images.length;
      
      return {
        count,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        averageSize: count > 0 ? (totalSize / count) : 0
      };
    } catch (error) {
      console.error('Erro ao verificar espaço:', error);
      return { count: 0, totalSize: 0, totalSizeMB: '0.00', averageSize: 0 };
    }
  }
}

// Singleton instance
const localImageStorage = new LocalImageStorage();

export default localImageStorage; 