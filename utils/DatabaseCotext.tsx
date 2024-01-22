import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const DatabaseContext = createContext(null);
const db = SQLite.openDatabase('mydb.db');
//db.closeAsync()
//db.deleteAsync()

const createTables = () => {
    if (db) {
        console.log("creating tables")
        db.transaction((tx) => {
            // Crea la tabla Group
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS [Group] (
                id INTEGER PRIMARY KEY,
                name TEXT,
                price REAL,
                logoPath TEXT,
                adminOnly BOOLEAN,
                notes TEXT
              );
            `);

            // Verifica si ya existe un registro en la tabla Group con el mismo nombre
            tx.executeSql(
              'SELECT COUNT(*) AS count FROM [Group]  WHERE name = ?',
              ['Packs'],
              (_, result) => {
                const rowCount = result.rows.item(0).count;
      
                if (rowCount === 0) {
                  console.log("Creating default")
                  // Si no existe un registro con el mismo nombre, inserta un registro por defecto
                  tx.executeSql(`
                    INSERT INTO [Group] (name, price, logoPath, adminOnly, notes)
                    VALUES ('Packs', 14, 'packs.png', 1, 'You can combine other products into packs'),
                    ('Stock', 1, 'stock.png', 1, 'You can create stock items for every group'),
                    ('Not ready', 0, '', 1, 'For admin use only'),
                    ('Not ready', 0, '', 1, 'For admin use only'),
                    ('Not ready', 0, '', 1, 'For admin use only'),
                    ('Not ready', 0, '', 1, 'For admin use only'),
                    ('Not ready', 0, '', 1, 'For admin use only'),
                    ('Not ready', 0, '', 1, 'For admin use only'),
                    ('Not ready', 0, '', 1, 'For admin use only');
                  `);
                }
              }
            );
          
            // Crea la tabla Saga
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS Saga (
                id INTEGER PRIMARY KEY,
                name TEXT
              );
            `);
          
            // Crea la tabla Product
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS Product (
                id INTEGER PRIMARY KEY,
                name TEXT,
                imagePath TEXT,
                price REAL,
                idGroup INTEGER,
                idSaga INTEGER,
                FOREIGN KEY (idGroup) REFERENCES [Group] (id),
                FOREIGN KEY (idSaga) REFERENCES Saga (id)
              );
            `);
          
            // Crea la tabla Pack
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS Pack (
                id INTEGER PRIMARY KEY,
                idProdBase INTEGER,
                idProdElem INTEGER,
                notes TEXT,
                FOREIGN KEY (idProdBase) REFERENCES Product (id),
                FOREIGN KEY (idProdElem) REFERENCES Product (id)
              );
            `);
        }, 
        (error) => console.log(error),
        () => console.log("Done"));
    }
};

createTables();

export const useDatabase = () => {
    return useContext(DatabaseContext);
};

export const DatabaseProvider = ({ children }) => {
    const [database, setDatabase] = useState(db);

    const crudGroup = (op: 'c' | 'r' | 'u' | 'd' = 'c', tableName, elements: Array<any>, id = undefined, callback: (data: any[]) => void = undefined) => {
        
        try {

            if(id != undefined) {
                console.log("Id defined")
            }
            var values = "NULL"
            if(elements)
            {   
                elements.forEach(element => {
                    values += ',?'
                });
            }
        
            switch(op) {
                case 'c':
                    var query = `INSERT INTO [${tableName}] VALUES (${values})`
                    console.log("Creating Element")
                    database.transaction((tx) => {
                        // Lógica para insertar datos en la base de datos.
                        tx.executeSql(query, elements, (_, result) => {
                            // Manejar el resultado de la inserción si es necesario.
                            console.log(result)
                        },
                        (_,result) => {
                            console.log(result)
                            return false;
                        });
                    });
                    break;
                case 'r':
                    var query = `Select * FROM [${tableName}] WHERE id > 0`
                    database.transaction((tx) => {
                        // Lógica para insertar datos en la base de datos.
                        tx.executeSql(query, elements, (_, result) => {
                            // Manejar el resultado de la inserción si es necesario.
                            console.log(result)
                            if(callback != undefined) callback(result.rows._array)
                            else console.log("Undefined callback")
                        },
                        (_,result) => {
                            console.log(result)
                            return false;
                        });
                    });
                    break;
                case 'u':
                    break;
                case 'd':
                    break;
            }
        } 
        catch(error) {
            console.log(error)
        }
    }

    // Generic
    const getAllTables = () =>{
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

    const printTableColumns = (column:string) => {
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

    const fetchData = (tableName: string, callback: (data: any[]) => void) => {
        const query = `SELECT * FROM [${tableName}]`
        if (database) {
            //console.log("Fetching")
        database.transaction((tx) => {
            // Lógica para recuperar datos de la base de datos.
            tx.executeSql(query, [], (_, result) => {
            // Manejar el resultado de la consulta si es necesario.
            const data = result.rows._array; // Obtener los datos como un arreglo.
            //console.log(data);
            callback(data);
            // Actualizar el estado o realizar otras acciones según tus necesidades.
            },
            (_, error) => {
                console.error('Error en la consulta SQL: ', error);
                return false;
            }
            );
        });
        }
    };

    const deleteItem = (tableName, idValue) => {
        const query = `DELETE FROM [${tableName}] WHERE id=(?)`;
        db.transaction((tx) => {
          tx.executeSql(
            query,
            [idValue],
            (tx, result) => {
              // Manejar el resultado de la consulta
              const rows = result.rows._array;
              console.log(rows)
            },
            (error) => {
              console.error("Error al ejecutar la consulta:", error);
              return false;
            }
          );
        });
    }

    // Group
    const readPublicGroups = (callback: (data: any[]) => void) => {
        var query = `Select * FROM [Group] WHERE id > 9`
        database.transaction((tx) => {
            // Lógica para insertar datos en la base de datos.
            tx.executeSql(query, [], (_, result) => {
                // Manejar el resultado de la inserción si es necesario.
                console.log(result)
                callback(result.rows._array)
            },
            (_,result) => {
                console.log(result)
                return false;
            });
        });
    }

    const createGroup = (items, callback: (data: any) => void) => {
        console.log("Creating group")
        var query = `INSERT INTO [Group] VALUES (NULL, ?, ?, ?, ?, ?)`
        database.transaction((tx) => {
            // Lógica para insertar datos en la base de datos.
            tx.executeSql(query, items, (_, result) => {
                console.log("Created group")
                // Manejar el resultado de la inserción si es necesario.
                console.log(result)
                const newGroupId = result.insertId; // Obtén el ID del grupo recién creado
                // Crea el nuevo grupo con los datos que desees
                const newGroup = {
                    id: newGroupId,
                    name: items[0],
                    price : items[1],
                    logoPath : items[2],
                    adminOnly : items[3],
                    notes : items[4],
                };
                callback(newGroup)
            },
            (_,result) => {
                console.log(result)
                return false;
            });
        });
    } 
    const updateGroup = (groupId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing group");
      var query = `
          UPDATE [Group]
          SET name = ?,
              price = ?,
              logoPath = ?,
              adminOnly = ?,
              notes = ?
          WHERE id = ?`;
      const params = [updatedValues[0], updatedValues[1], updatedValues[2], updatedValues[3], updatedValues[4], groupId];
      console.log(params)
      database.transaction((tx) => {
          console.log("About to execute")
          tx.executeSql(query, params, (_, result) => {
              console.log("Edited group");
              // Puedes manejar el resultado de la edición si es necesario.
              console.log(result);
  
              // Si deseas obtener los nuevos valores después de la edición,
              // puedes consultar la base de datos o usar los valores actualizados
              // directamente de 'updatedValues'.
              const editedGroup = {
                  id: groupId,
                  name: updatedValues[0],
                  price : updatedValues[1],
                  logoPath : updatedValues[2],
                  adminOnly : updatedValues[3],
                  notes : updatedValues[4],
              };
              callback(editedGroup);
          },
          (_, result) => {
              console.log("Execute Error")
              console.log(result);
              return false;
          });
      }, (error) => {console.log(error)});
    };

    // Product
    const readAllProducts = (callback: (data: any[]) => void) => {
      var query = `Select * FROM [Product]`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, [], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              console.log(result)
              callback(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    }
    
    const createProduct = (items, callback: (data: any) => void) => {
      console.log("Creating product")
      var query = `INSERT INTO [Product] VALUES (NULL, ?, ?, ?, ?, ?)`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, items, (_, result) => {
              console.log("Created product")
              // Manejar el resultado de la inserción si es necesario.
              console.log(result)
              const newProductId = result.insertId; // Obtén el ID del grupo recién creado
              // Crea el nuevo grupo con los datos que desees
              const newProduct = {
                  id: newProductId,
                  name: items[0],
                  imagePath : items[1],
                  price : items[2],
                  idGroup : items[3],
                  idSaga : items[4],
              };
              callback(newProduct)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    } 
    
    const updateProduct = (productId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing Product");
      var query = `
          UPDATE [Product]
          SET name = ?,
              imagePath = ?,
              price = ?,
              idGroup = ?,
              idSaga = ?
          WHERE id = ?`;
      const params = [updatedValues[0], updatedValues[1], updatedValues[2], updatedValues[3], updatedValues[4], productId];
      console.log(params)
      database.transaction((tx) => {
          console.log("About to execute")
          tx.executeSql(query, params, (_, result) => {
              console.log("Edited group");
              // Puedes manejar el resultado de la edición si es necesario.
              console.log(result);
  
              // Si deseas obtener los nuevos valores después de la edición,
              // puedes consultar la base de datos o usar los valores actualizados
              // directamente de 'updatedValues'.
              const editedProduct = {
                  id: productId,
                  name: updatedValues[0],
                  imagePath : updatedValues[1],
                  price : updatedValues[2],
                  idGroup : updatedValues[3],
                  idSaga : updatedValues[4],
              };
              callback(editedProduct);
          },
          (_, result) => {
              console.log("Execute Error")
              console.log(result);
              return false;
          });
      }, (error) => {console.log(error)});
    };
    
    // Saga
    const readAllSagas = (callback: (data: any[]) => void) => {
      var query = `Select * FROM [Saga]`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, [], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              console.log(result)
              callback(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    }
    
    const createSaga = (items, callback: (data: any) => void) => {
      console.log("Creating Saga")
      var query = `INSERT INTO [Saga] VALUES (NULL, ?)`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, items, (_, result) => {
              console.log("Created Saga")
              // Manejar el resultado de la inserción si es necesario.
              console.log(result)
              const newSagaId = result.insertId; // Obtén el ID del grupo recién creado
              // Crea el nuevo grupo con los datos que desees
              const newSaga = {
                  id: newSagaId,
                  name: items[0],
              };
              callback(newSaga)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    } 
    
    const updateSaga = (sagaId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing Saga");
      var query = `
          UPDATE [Saga]
          SET name = ?
          WHERE id = ?`;
      const params = [updatedValues[0], sagaId];
      console.log(params)
      database.transaction((tx) => {
          console.log("About to execute")
          tx.executeSql(query, params, (_, result) => {
              console.log("Edited Saga");
              // Puedes manejar el resultado de la edición si es necesario.
              console.log(result);
  
              // Si deseas obtener los nuevos valores después de la edición,
              // puedes consultar la base de datos o usar los valores actualizados
              // directamente de 'updatedValues'.
              const editedSaga = {
                  id: sagaId,
                  name: updatedValues[0]
              };
              callback(editedSaga);
          },
          (_, result) => {
              console.log("Execute Error")
              console.log(result);
              return false;
          });
      }, (error) => {console.log(error)});
    };
    
  return (
    <DatabaseContext.Provider value={{ database, fetchData, getAllTables, printTableColumns, crudGroup, deleteItem, readPublicGroups, createGroup, updateGroup, readAllProducts, createProduct, updateProduct, readAllSagas, createSaga, updateSaga }}>
      {children}
    </DatabaseContext.Provider>
  );
};