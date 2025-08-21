export const DB_CONFIG = {
  name: 'TodoListDB',
  version: 1,
  stores: {
    todos: {
      name: 'todos',
      keyPath: 'id',
      indexes: [
        { name: 'completed', keyPath: 'completed' },
        { name: 'createdAt', keyPath: 'createdAt' },
      ],
    },
  },
} as const;

export class DatabaseManager {
  private db: IDBDatabase | null = null;

  async open(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(DB_CONFIG.stores.todos.name)) {
          const store = db.createObjectStore(
            DB_CONFIG.stores.todos.name,
            { keyPath: DB_CONFIG.stores.todos.keyPath }
          );

          DB_CONFIG.stores.todos.indexes.forEach(({ name, keyPath }) => {
            store.createIndex(name, keyPath);
          });
        }
      };
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async getTransaction(
    storeNames: string | string[],
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBTransaction> {
    const db = await this.open();
    return db.transaction(storeNames, mode);
  }
}

export const dbManager = new DatabaseManager();