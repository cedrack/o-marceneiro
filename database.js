// Sistema de Banco de Dados IndexedDB
class Database {
    constructor() {
        this.dbName = 'MarceneiroDB';
        this.version = 1;
        this.db = null;
    }

    // Inicializar banco de dados
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Erro ao abrir banco de dados:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Banco de dados inicializado com sucesso');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Object Store para Usuários
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: false });
                    userStore.createIndex('email', 'email', { unique: true });
                }

                // Object Store para Produtos
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: false });
                    productStore.createIndex('category', 'category', { unique: false });
                    productStore.createIndex('featured', 'featured', { unique: false });
                    productStore.createIndex('inStock', 'inStock', { unique: false });
                }

                // Object Store para Carrinho
                if (!db.objectStoreNames.contains('cart')) {
                    const cartStore = db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
                    cartStore.createIndex('userId', 'userId', { unique: false });
                    cartStore.createIndex('productId', 'productId', { unique: false });
                }

                // Object Store para Pedidos
                if (!db.objectStoreNames.contains('orders')) {
                    const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: false });
                    orderStore.createIndex('userId', 'userId', { unique: false });
                    orderStore.createIndex('status', 'status', { unique: false });
                    orderStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Object Store para Favoritos
                if (!db.objectStoreNames.contains('favorites')) {
                    const favoriteStore = db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
                    favoriteStore.createIndex('userId', 'userId', { unique: false });
                    favoriteStore.createIndex('productId', 'productId', { unique: false });
                    favoriteStore.createIndex('userProduct', ['userId', 'productId'], { unique: true });
                }

                console.log('Estrutura do banco de dados criada');
            };
        });
    }

    // Garantir que o banco está inicializado
    async ensureInit() {
        if (!this.db) {
            await this.init();
        }
        return this.db;
    }

    // ========== USUÁRIOS ==========
    async addUser(user) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add(user);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserById(id) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserByEmail(email) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('email');
            const request = index.get(email);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllUsers() {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateUser(id, updates) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const user = getRequest.result;
                if (user) {
                    Object.assign(user, updates);
                    const updateRequest = store.put(user);
                    updateRequest.onsuccess = () => resolve(user);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    reject(new Error('Usuário não encontrado'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    // ========== PRODUTOS ==========
    async addProduct(product) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.add(product);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getProductById(id) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProducts() {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateProduct(id, updates) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const product = getRequest.result;
                if (product) {
                    Object.assign(product, updates);
                    const updateRequest = store.put(product);
                    updateRequest.onsuccess = () => resolve(product);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    reject(new Error('Produto não encontrado'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteProduct(id) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ========== CARRINHO ==========
    async addToCart(userId, productId, quantity = 1) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cart'], 'readwrite');
            const store = transaction.objectStore('cart');
            const index = store.index('userProduct');
            
            // Verificar se já existe
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
                const existing = getAllRequest.result.find(
                    item => item.userId === userId && item.productId === productId
                );

                if (existing) {
                    existing.quantity += quantity;
                    const updateRequest = store.put(existing);
                    updateRequest.onsuccess = () => resolve(existing);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    const newItem = {
                        userId: userId,
                        productId: productId,
                        quantity: quantity
                    };
                    const addRequest = store.add(newItem);
                    addRequest.onsuccess = () => resolve(newItem);
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };
            getAllRequest.onerror = () => reject(getAllRequest.error);
        });
    }

    async getCart(userId) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cart'], 'readonly');
            const store = transaction.objectStore('cart');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateCartItem(id, quantity) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cart'], 'readwrite');
            const store = transaction.objectStore('cart');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (item) {
                    if (quantity <= 0) {
                        const deleteRequest = store.delete(id);
                        deleteRequest.onsuccess = () => resolve(null);
                        deleteRequest.onerror = () => reject(deleteRequest.error);
                    } else {
                        item.quantity = quantity;
                        const updateRequest = store.put(item);
                        updateRequest.onsuccess = () => resolve(item);
                        updateRequest.onerror = () => reject(updateRequest.error);
                    }
                } else {
                    reject(new Error('Item não encontrado'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async clearCart(userId) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cart'], 'readwrite');
            const store = transaction.objectStore('cart');
            const index = store.index('userId');
            const request = index.openCursor(userId);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // ========== PEDIDOS ==========
    async addOrder(order) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const request = store.add(order);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getOrderById(id) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getOrdersByUser(userId) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllOrders() {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ========== FAVORITOS ==========
    async toggleFavorite(userId, productId) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readwrite');
            const store = transaction.objectStore('favorites');
            const index = store.index('userProduct');
            const request = index.get([userId, productId]);

            request.onsuccess = () => {
                const favorite = request.result;
                if (favorite) {
                    // Remover favorito
                    const deleteRequest = store.delete(favorite.id);
                    deleteRequest.onsuccess = () => resolve(false);
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                } else {
                    // Adicionar favorito
                    const newFavorite = {
                        userId: userId,
                        productId: productId
                    };
                    const addRequest = store.add(newFavorite);
                    addRequest.onsuccess = () => resolve(true);
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getFavorites(userId) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readonly');
            const store = transaction.objectStore('favorites');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => resolve(request.result.map(f => f.productId));
            request.onerror = () => reject(request.error);
        });
    }

    async isFavorite(userId, productId) {
        const db = await this.ensureInit();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readonly');
            const store = transaction.objectStore('favorites');
            const index = store.index('userProduct');
            const request = index.get([userId, productId]);

            request.onsuccess = () => resolve(!!request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ========== MIGRAÇÃO DE DADOS ==========
    async migrateFromLocalStorage() {
        await this.ensureInit();
        try {
            // Migrar usuários
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            for (const user of users) {
                try {
                    await this.addUser(user);
                } catch (e) {
                    // Usuário já existe, ignorar
                }
            }

            // Migrar produtos
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            for (const product of products) {
                try {
                    await this.addProduct(product);
                } catch (e) {
                    // Produto já existe, atualizar
                    await this.updateProduct(product.id, product);
                }
            }

            // Migrar pedidos
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            for (const order of orders) {
                try {
                    await this.addOrder(order);
                } catch (e) {
                    // Pedido já existe, ignorar
                }
            }

            console.log('Migração do localStorage concluída');
        } catch (error) {
            console.error('Erro na migração:', error);
        }
    }
}

// Instância global
const db = new Database();

// Inicializar automaticamente
db.init().then(async () => {
    // Migrar dados do localStorage na primeira vez
    await db.migrateFromLocalStorage();
}).catch(error => {
    console.error('Erro ao inicializar banco de dados:', error);
});

// Exportar para uso global
if (typeof globalThis !== 'undefined') {
    globalThis.db = db;
}

