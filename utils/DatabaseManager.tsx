import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('merch.db'); // Nombre de la base de datos


//db.closeAsync()
//db.deleteAsync()
console.log(db)


class DatabaseManager {
  constructor() {
    // Crea la tabla 'items' si no existe
    console.log("Constructor called");
   
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
        [],
        (_,res) => {
          // La tabla 'items' se ha creado correctamente o ya existía
          console.log(res);
          console.log("Table created");
          this.insertDefaultItemsIfNeeded();
        },
        (error) => {
          console.error('Error al crear la tabla de items:', error);
          return false;
        }
      );
    });
 
    console.log("Try finished");
  }


  printText(text:string) {
    console.log(text)
  }


  getAllTables() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table';",
        [],
        (tx, result) => {
          // Manejar el resultado de la consulta
          const rows = result.rows;
          const tableNames = [];
         
          for (let i = 0; i < rows.length; i++) {
            tableNames.push(rows.item(i).name);
          }
         
          console.log("Tablas en la base de datos:", tableNames);
        },
        (error) => {
          console.error("Error al ejecutar la consulta:", error);
          return false;
        }
      );
    });


  }


  printTableColumns(column:string) {
    const query = `PRAGMA table_info(${column});`;


    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          // Manejar el resultado de la consulta
          const rows = result.rows;
          const columnNames = [];


          for (let i = 0; i < rows.length; i++) {
            columnNames.push(rows.item(i).name);
          }


          console.log("Columnas en la tabla:", columnNames);
        },
        (error) => {
          console.error("Error al ejecutar la consulta:", error);
          return false;
        }
      );
    });
  }


  insertDefaultItemsIfNeeded() {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM items',
        [],
        (_, result) => {
          const rowCount = result.rows.item(0).count;
          if (rowCount === 0) {
            // Si no hay filas en la tabla, inserta las entradas por defecto
            this.insertDefaultItems();
          }
        },
        (error) => {
          console.error('Error al verificar el recuento de filas en la tabla de items:', error);
          return false;
        }
      );
    });
  }


  insertDefaultItems() {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO items (name) VALUES (?), (?), (?)',
        ['Item 1', 'Item 2', 'Item 3'],
        () => {
          console.log('Entradas por defecto insertadas correctamente.');
        },
        (error) => {
          console.error('Error al insertar entradas por defecto en la tabla de items:', error);
          return false;
        }
      );
    });
  }




  // Método para agregar un nuevo elemento a la tabla 'items'
  addItem(name: string, callback: (insertedId: number | null) => void) {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO items (name) VALUES (?)',
        [name],
        (_, result) => {
          callback(result.insertId);
          return false; // Devuelve false para indicar que la transacción debe continuar
        },
        (_, error) => {
          console.error('Error al agregar un elemento:', error);
          callback(null);
          return false; // Devuelve false para indicar que la transacción debe continuar
        }
      );
    });
  }


  // Método para obtener todos los elementos de la tabla 'items'
  getAllItems(callback: (items: any[]) => void) {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items',
        [],
        (_, result) => {
          console.log(" All items = ",result);
          const items = result.rows._array;
          callback(items);
          return true; // Devuelve false para indicar que la transacción debe continuar
        },
        (_, error) => {
          console.log(error);
          console.error('Error al obtener elementos:', error);
          callback([]);
          return false; // Devuelve false para indicar que la transacción debe continuar
        }
      );
    });
  }


  closeDatabase() {
    db.closeAsync(); // Donde 'db' es la instancia de la base de datos
  }
  openDatabase() {
    SQLite.openDatabase('merch.db');
  }


  dropAllTables = () => {
    db.transaction((tx) => {
      // Consulta la lista de tablas en la base de datos
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'",
        [],
        (_, result) => {
          // Recorre los resultados y ejecuta DROP TABLE para cada tabla
          for (let i = 0; i < result.rows.length; i++) {
            const tableName = result.rows.item(i).name;
            if (tableName !== 'sqlite_sequence') {
              // Evita eliminar la tabla 'sqlite_sequence', que se usa para AUTOINCREMENT
              tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
            }
          }
          console.log('Todas las tablas han sido eliminadas.');
        },
        (_, error) => {
          console.error('Error al obtener la lista de tablas:', error);
          return false;
        }
      );
    });
  };


  executeQuery(query:string, completed, stopped) {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          // Manejar el resultado de la consulta
          completed(result)
        },
        (error) => {
          stopped(error);
          return false;
        }
      );
    });
  }
}


export default DatabaseManager;
