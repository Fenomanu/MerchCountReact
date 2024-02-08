import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const DatabaseContext = createContext(null);
const db = SQLite.openDatabase('mydb.db');
//db.closeAsync()
//db.deleteAsync()

const createTables = () => {
    if (db) {
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
                  // Si no existe un registro con el mismo nombre, inserta un registro por defecto
                  tx.executeSql(`
                    INSERT INTO [Group] (name, price, logoPath, adminOnly, notes)
                    VALUES ('Packs', 14, 'tag-multiple', 1, 'You can combine other products into packs'),
                    ('Stock', 1, 'cash', 1, 'You can create stock items for every group'),
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
                name TEXT,
                color TEXT
              );
            `);
          
            // Crea la tabla Product
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS Product (
                id INTEGER PRIMARY KEY,
                name TEXT,
                imagePath TEXT,
                price REAL,
                isSoldOut BOOLEAN,
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
                FOREIGN KEY (idProdBase) REFERENCES Product (id),
                FOREIGN KEY (idProdElem) REFERENCES Product (id)
              );
            `);
            
            // Crea la tabla Product
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS [Order] (
                id INTEGER PRIMARY KEY,
                price REAL,
                orderTime DATETIME
              );
            `);
          
            // Crea la tabla Pack
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS OrderDetail (
                id INTEGER PRIMARY KEY,
                idOrder INTEGER,
                ammount INTEGER,
                idProd INTEGER,
                FOREIGN KEY (idOrder) REFERENCES [Order] (id),
                FOREIGN KEY (idProd) REFERENCES Product (id)
              );
            `);
            
            // Crea la tabla Pack
            tx.executeSql(`
              CREATE TABLE IF NOT EXISTS SoldOut (
                id INTEGER PRIMARY KEY,
                idProd INTEGER,
                isSoldOut BOOLEAN,
                soldOutTime DATETIME,
                FOREIGN KEY (idProd) REFERENCES Product (id)
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
    };

    const printTableColumns = (table:string) => {
      const query = `PRAGMA table_info(${table});`;
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
    };

    const fetchData = (tableName: string, callback: (data: any[]) => void) => {
        const query = `SELECT * FROM [${tableName}]`
        if (database) {
        database.transaction((tx) => {
            // Lógica para recuperar datos de la base de datos.
            tx.executeSql(query, [], (_, result) => {
            // Manejar el resultado de la consulta si es necesario.
            const data = result.rows._array; // Obtener los datos como un arreglo.
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
            },
            (error) => {
              console.error("Error al ejecutar la consulta:", error);
              return false;
            }
          );
        });
    };

    // Group
    const readPublicGroups = (callback: (data: any[]) => void) => {
        var query = `Select * FROM [Group] WHERE adminOnly = 0`
        database.transaction((tx) => {
            // Lógica para insertar datos en la base de datos.
            tx.executeSql(query, [], (_, result) => {
                // Manejar el resultado de la inserción si es necesario.
                callback(result.rows._array)
            },
            (_,result) => {
                console.log(result)
                return false;
            });
        });
    };

    const readPublicGroupsAndDict = (callback: (data: any[]) => void, dictSet: (data: {}) => void) => {
      //groups = {id:{name, logoPath}} (dict)
        var query = `Select * FROM [Group] WHERE adminOnly = 0`
        database.transaction((tx) => {
            // Lógica para insertar datos en la base de datos.
            tx.executeSql(query, [], (_, result) => {
                // Manejar el resultado de la inserción si es necesario.
                callback(result.rows._array)
                var groups = {}
                result.rows._array.forEach(element => {
                  if (!groups[element.id]) groups[element.id] = {name : element.name, logoPath : element.logoPath}
                });
                dictSet(groups)
            },
            (_,result) => {
                console.log(result)
                return false;
            });
        });
    };

    const createGroup = (items, callback: (data: any) => void) => {
        var query = `INSERT INTO [Group] VALUES (NULL, ?, ?, ?, ?, ?)`
        database.transaction((tx) => {
            // Lógica para insertar datos en la base de datos.
            tx.executeSql(query, items, (_, result) => {
                // Manejar el resultado de la inserción si es necesario.
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
    };

    const updateGroup = (groupId, updatedValues, callback: (data: any) => void) => {
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

    const checkGroupDelete = (idGroup, deleteCall: () => void, showAlert: () => void) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM Product WHERE idGroup = ?',
          [idGroup],
          (_, result) => {
            const count = result.rows._array[0].count;
            if (count === 0) {
              // Paso 2: No hay entradas en Producto, por lo que puedes borrar el grupo
              deleteCall()
            } else {
              showAlert()
            }
          },
          error => {
            console.error('Error al verificar las entradas en Producto:', error);
            return false
          }
        );
      });
    }

    // Product
    const readAllProducts = (callback: (data: any[]) => void) => {
      var query = `Select * FROM [Product] WHERE idGroup > 9`
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
    };
    
    const searchProduct = (name, callback: (data: any[]) => void) => {
      var query = `SELECT Product.id, Product.name, [Group].name AS groupName
        FROM [Product] INNER JOIN [Group] ON Product.idGroup = [Group].id WHERE [Group].adminOnly = 0 AND Product.name LIKE ? LIMIT 3;`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, [`%${name}%`], (_, result) => {
              // Manejar el resultado de la consulta si es necesario.
              callback(result.rows._array)
          },
          (_, result) => {
              console.log(result)
              return false;
          });
      }, (error) => console.log(error));
    };

    const getProdNames = (list, callback: (data: {}) => void) => {
      // Construye la cadena de IDs separada por comas
      const idString = list.join(',');
    
      var query = `SELECT Product.id, Product.name, [Group].name AS [group]
        FROM [Product] INNER JOIN [Group] ON Product.idGroup = [Group].id WHERE Product.id IN (${idString});`
    
      database.transaction((tx) => {
        tx.executeSql(query, [], (_, result) => {
          // Manejar el resultado de la consulta si es necesario.
          const objetoResultado = {};
          result.rows._array.forEach(objeto => {
            objetoResultado[objeto.id] = { name: objeto.name, group: objeto.group };
          });
          callback(objetoResultado);
        },
        (_, result) => {
          console.log(result);
          return false;
        });
      });
    };
    
    const createProduct = (items, callback: (data: any) => void) => {
      console.log("Creating product")
      var query = `INSERT INTO [Product] VALUES (NULL, ?, ?, ?, 0, ?, ?)`
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
                  isSoldOut : 0,
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
    };
    
    const updateProduct = (productId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing Product");
      var query = `
          UPDATE [Product]
          SET name = ?,
              imagePath = ?,
              price = ?,
              isSoldOut = ?,
              idGroup = ?,
              idSaga = ?
          WHERE id = ?`;
      const params = [updatedValues[0], updatedValues[1], updatedValues[2], updatedValues[3], updatedValues[4], updatedValues[5], productId];
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
                  isSoldOut : updatedValues[3],
                  idGroup : updatedValues[4],
                  idSaga : updatedValues[5],
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

    const cloneProduct = (value, callback: (data : any) => void) => {
      const query = `INSERT INTO [Product] (name, imagePath, price, isSoldOut, idGroup, idSaga)
      SELECT name, imagePath, price, isSoldOut, idGroup, idSaga
      FROM [Product]
      WHERE id = ?;`
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [value.id],
          (tx, result) => {
            // Manejar el resultado de la consulta
              // Crea el nuevo grupo con los datos que desees
              const newProductId = result.insertId; // Obtén el ID del grupo recién creado
              const newProduct = {
                id: newProductId,
                name: value.name,
                imagePath : value.imagePath,
                price : value.price,
                isSoldOut : value.isSoldOut,
                idGroup : value.idGroup,
                idSaga : value.idSaga,
            };
            callback(newProduct)
          },
          (error) => {
            console.error("Error al ejecutar la consulta:", error);
            return false;
          }
        );
      });
    }

    const getButtonsWithPacks = (callback : (data:any) => void) => {
      console.log("Buttons with packs")
      const query =
        `SELECT
            P.id,
            P.name,
            CASE
                WHEN P.idGroup = 1 THEN
                    (SELECT GROUP_CONCAT(P1.imagePath, ', ')
                    FROM Product AS P1
                    INNER JOIN Pack AS Pack1 ON P1.id = Pack1.idProdElem
                    WHERE Pack1.idProdBase = P.id)
                ELSE
                    P.imagePath
            END AS imagePath,
            P.price,
            P.isSoldOut,
            P.idGroup,
            P.idSaga
        FROM Product AS P WHERE P.idGroup = 1;`
      database.transaction((tx) => {
        // Lógica para insertar datos en la base de datos.
        tx.executeSql(query, [], (_, result) => {
            // Manejar el resultado de la inserción si es necesario.
            console.log(result.rows._array)
            var sagas = {}
            result.rows._array.forEach(element => {
              if (!sagas[element.idSaga]) sagas[element.idSaga] = []
              sagas[element.idSaga].push(element)
            });
            console.log("Sagas array")
            if(sagas){
              callback(sagas)
            }
            else {callback({})}
        },
        (_,result) => {
            console.log(result)
            return false;
        });
      });
    }

    const getMostSold = (idGroup, callback: (data : any) => void) => {
      const query = idGroup < 0 ? `SELECT Product.*, SUM(OrderDetail.ammount) AS totalAmount
        FROM OrderDetail
        INNER JOIN Product ON OrderDetail.idProd = Product.id
        GROUP BY OrderDetail.idProd
        ORDER BY totalAmount DESC
        LIMIT 10;` 
        : 
        `SELECT Product.*, SUM(OrderDetail.ammount) AS totalAmount
        FROM OrderDetail
        INNER JOIN Product ON OrderDetail.idProd = Product.id
        WHERE Product.idGroup = ${idGroup}
        GROUP BY OrderDetail.idProd
        ORDER BY totalAmount DESC
        LIMIT 10;`
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

    const getMostSoldWithPacks = (idGroup, callback: (data : any) => void) => {
      const query = idGroup < 0 ? `SELECT 
          P.id,
          P.name,
          CASE
              WHEN P.idGroup = 1 THEN
                  (SELECT GROUP_CONCAT(P1.imagePath, ', ')
                  FROM Product AS P1
                  INNER JOIN Pack AS Pack1 ON P1.id = Pack1.idProdElem
                  WHERE Pack1.idProdBase = P.id)
              ELSE
                  P.imagePath
          END AS imagePath,
          P.price,
          P.isSoldOut,
          P.idGroup,
          P.idSaga, 
          SUM(OrderDetail.ammount) AS totalAmount
        FROM OrderDetail
        INNER JOIN Product AS P ON OrderDetail.idProd = P.id
        WHERE P.isSoldOut = 0
        GROUP BY OrderDetail.idProd
        ORDER BY totalAmount DESC
        LIMIT 10;` 
        : 
        `SELECT 
            P.id,
            P.name,
            CASE
                WHEN P.idGroup = 1 THEN
                    (SELECT GROUP_CONCAT(P1.imagePath, ', ')
                    FROM Product AS P1
                    INNER JOIN Pack AS Pack1 ON P1.id = Pack1.idProdElem
                    WHERE Pack1.idProdBase = P.id)
                ELSE
                    P.imagePath
            END AS imagePath,
            P.price,
            P.isSoldOut,
            P.idGroup,
            P.idSaga, 
            SUM(OrderDetail.ammount) AS totalAmount
        FROM OrderDetail
        INNER JOIN Product AS P ON OrderDetail.idProd = P.id
        WHERE P.idGroup = ${idGroup} AND P.isSoldOut = 0
        GROUP BY OrderDetail.idProd
        ORDER BY totalAmount DESC
        LIMIT 10;` 
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

    const checkProductDelete = (idProduct, deleteCall: () => void, showAlert: () => void) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT COUNT(*) as count 
          FROM Pack
          WHERE idProdElem = ?
             OR ? IN (
                SELECT idProd
                FROM OrderDetail
             );`,
          [idProduct, idProduct],
          (_, result) => {
            const count = result.rows._array[0].count;
            console.log("Before deleting product")
            console.log(result.rows._array)
            if (count === 0) {
              // Paso 2: No hay entradas en Producto, por lo que puedes borrar el grupo
              deleteCall()
            } else {
              showAlert()
            }
          },
          error => {
            console.error('Error al verificar las entradas en Producto:', error);
            return false
          }
        );
      });
    }
    
    const checkAdminDelete = (idProduct, deleteCall: () => void, showAlert: () => void) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT COUNT(*) as count FROM OrderDetail WHERE idProd = ?;`,
          [idProduct],
          (_, result) => {
            const count = result.rows._array[0].count;
            console.log("Before deleting product")
            console.log(result.rows._array)
            if (count === 0) {
              // Paso 2: No hay entradas en Producto, por lo que puedes borrar el grupo
              deleteCall()
            } else {
              showAlert()
            }
          },
          error => {
            console.error('Error al verificar las entradas en Producto:', error);
            return false
          }
        );
      });
    }
    
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
    };
    
    const readAllSagasAndDict = (callback: (data: any[]) => void, dictSet: (data: {}) => void) => {
      var query = `Select * FROM [Saga]`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, [], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              console.log(result)
              callback(result.rows._array)
              var sagas = {}
              result.rows._array.forEach(element => {
                if (!sagas[element.id]) sagas[element.id] = {name : element.name}
                dictSet(sagas)
              });
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    };

    const createSaga = (items, callback: (data: any) => void) => {
      console.log("Creating Saga")
      var query = `INSERT INTO [Saga] VALUES (NULL, ?, ?)`
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
                  color : items[1],
              };
              callback(newSaga)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    };
    
    const updateSaga = (sagaId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing Saga");
      var query = `
          UPDATE [Saga]
          SET name = ?,
              color = ?
          WHERE id = ?`;
      const params = [updatedValues[0], updatedValues[1], sagaId];
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
                  name: updatedValues[0],
                  color : updatedValues[1]
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

    const checkSagaDelete = (idGroup, deleteCall: () => void, showAlert: () => void) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM Product WHERE idSaga = ?',
          [idGroup],
          (_, result) => {
            const count = result.rows._array[0].count;
            if (count === 0) {
              // Paso 2: No hay entradas en Producto, por lo que puedes borrar el grupo
              deleteCall()
            } else {
              showAlert()
            }
          },
          error => {
            console.error('Error al verificar las entradas en Producto:', error);
            return false
          }
        );
      });
    }

    // Packs
    const readAllPacks = (callback: (data: any[]) => void) => {
      var query =`
        SELECT P.*, 
              (SELECT GROUP_CONCAT(idProdElem, ',')
              FROM Pack 
              WHERE idProdBase = P.id) AS idProdElemList
        FROM Product AS P WHERE P.idGroup = 1`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, [], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              const productsWithIdProdElem = result.rows._array.map((row) => {
                const idProdElemList = row.idProdElemList ? row.idProdElemList.split(',').map(Number) : [];
                return { ...row, idProdElemList };
              });
              console.log("Reading")
              console.log(productsWithIdProdElem)
              callback(productsWithIdProdElem)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    }
    
    const createPack = (items, callback: (data: any) => void) => {
      console.log("Creating Pack Product")
      var query = `INSERT INTO [Product] VALUES (NULL, ?, ?, ?, 0, 1, ?)`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, items.slice(0,-1), (_, result) => {
              console.log("Created product")
              // Manejar el resultado de la inserción si es necesario.
              console.log(result.insertId)
              const newProductId = result.insertId; // Obtén el ID del grupo recién creado
              // Crea el nuevo grupo con los datos que desees
              const newProduct = {
                  id: newProductId,
                  name: items[0],
                  imagePath : items[1],
                  price : items[2],
                  isSoldOut : 0,
                  idGroup : 1,
                  idSaga : items[3],
                  idProdElemList : []
              };

              if (items[4] && items[4].length > 0 && newProductId >= 0) {
                console.log("Adding elements too")
                query = `INSERT INTO [Pack] (idProdBase, idProdElem) VALUES (?, ?)`;
                var params = [newProductId, items[4][0]];
                var b = false;

                items[4].forEach(element => {
                  if (b) {
                    params.push(newProductId, element);
                    query += `, (?, ?)`; // Agrega placeholders adicionales a la sentencia SQL
                  } else {
                    b = true;
                  }
                });

                console.log(params);

                tx.executeSql(query, params, (_, result) => {
                  console.log("Created product");
                  // Manejar el resultado de la inserción si es necesario.
                  console.log(result);
                  const newPackId = result.insertId; // Obtén el ID del grupo recién creado
                  // Crea el nuevo grupo con los datos que desees
                  if (newProduct.idProdElemList) {
                    newProduct.idProdElemList = newProduct.idProdElemList.concat(items[4]);
                    callback(newProduct);
                  }
                }, (_, result) => {
                  console.log(result);
                  return false;
                });
              }
              else {
                callback(newProduct)
              }

          },
          (_,result) => {
              console.log(result)
              return false;
          });
      }, (result) => console.log(result));
    } 
    
    const updatePack = (packId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing Pack");
      var query = `
          UPDATE [Product]
          SET name = ?,
              imagePath = "",
              price = ?,
              isSoldOut = ?,
              idGroup = 1,
              idSaga = ?
          WHERE id = ?`;
      const params = [updatedValues[0], updatedValues[1], updatedValues[2], updatedValues[3], packId];
      console.log(params)
      database.transaction((tx) => {
          console.log("About to execute")
          tx.executeSql(query, params, (_, result) => {
            console.log("Edited pack");
            // Puedes manejar el resultado de la edición si es necesario.
            console.log(result);
            // Si deseas obtener los nuevos valores después de la edición,
            // puedes consultar la base de datos o usar los valores actualizados
            // directamente de 'updatedValues'.
            const editedPack = {
                id: packId,
                name: updatedValues[0],
                imagePath : "",
                price : updatedValues[1],
                isSoldOut : updatedValues[2],
                idGroup : 1,
                idSaga : 0,
                idProdElemList : []
            };

            tx.executeSql(`DELETE FROM [Pack] WHERE idProdBase=(?)`, [packId], (_,result) => {
              if (updatedValues[4] && updatedValues[4].length > 0) {
                console.log("Adding elements too")
                query = `INSERT INTO [Pack] (idProdBase, idProdElem) VALUES (?, ?)`;
                var params = [packId, updatedValues[4][0]];
                var b = false;
                console.log(updatedValues[4])
                updatedValues[4].forEach(element => {
                  if (b) {
                    params.push(packId, element);
                    query += `, (?, ?)`; // Agrega placeholders adicionales a la sentencia SQL
                  } else {
                    b = true;
                  }
                });

                console.log(params);

                tx.executeSql(query, params, (_, result) => {
                  console.log("Created elements");
                  // Manejar el resultado de la inserción si es necesario.
                  console.log(result);
                  const newPackId = result.insertId; // Obtén el ID del grupo recién creado
                  // Crea el nuevo grupo con los datos que desees
                  if (editedPack.idProdElemList) {
                    editedPack.idProdElemList = editedPack.idProdElemList.concat(updatedValues[4]);
                    console.log(editedPack.idProdElemList)
                    callback(editedPack);
                  }
                }, (_, result) => {
                  console.log(result);
                  return false;
                });
              }
              else {
                callback(editedPack)
              }
            })
          },
          (_, result) => {
              console.log("Execute Error")
              console.log(result);
              return false;
          });
      }, (error) => {console.log(error)});
    };

    const deletePack = (idValue) => {
      const query = `DELETE FROM [Pack] WHERE idProdBase=(?)`;
      const query2 = `DELETE FROM [Product] WHERE id=(?)`;
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [idValue],
          (tx, result) => {
            // Manejar el resultado de la consulta
            const rows = result.rows._array;
            console.log(rows)
            db.transaction((tx) => {
              tx.executeSql(
                query2,
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
          },
          (error) => {
            console.error("Error al ejecutar la consulta:", error);
            return false;
          }
        );
      });
    }

    const printPacks = () => {
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql('SELECT * FROM [Product] WHERE idGroup = 1',[], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              console.log(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
          tx.executeSql('SELECT * FROM [Pack]', [], (_, result) => {
            // Manejar el resultado de la inserción si es necesario.
            console.log(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    }

    // Stock
    const readAllStock = (callback: (data: any[]) => void) => {
      var query =` SELECT * FROM Product WHERE idGroup = 2`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, [], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              callback(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    };
    
    const createStock = (items, callback: (data: any) => void) => {
      console.log("Creating Pack Product")
      var query = `INSERT INTO [Product] VALUES (NULL, ?, ?, ?, 0, 2, ?)`
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql(query, items, (_, result) => {
              console.log("Created Stock")
              // Manejar el resultado de la inserción si es necesario.
              console.log(result.insertId)
              const newProductId = result.insertId; // Obtén el ID del grupo recién creado
              // Crea el nuevo grupo con los datos que desees
              const newStock = {
                  id: newProductId,
                  name: items[0],
                  imagePath : items[1],
                  price : items[2],
                  isSoldOut : 0,
                  idGroup : 2,
                  idSaga : items[3],
              };
              callback(newStock)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      }, (result) => console.log(result));
    };
    
    const updateStock = (productId, updatedValues, callback: (data: any) => void) => {
      console.log("Editing Product");
      var query = `
          UPDATE [Product]
          SET name = ?,
              imagePath = ?,
              price = ?,
              isSoldOut = ?,
              idGroup = 2,
              idSaga = ?
          WHERE id = ?`;
      const params = [updatedValues[0], updatedValues[1], updatedValues[2], updatedValues[3], updatedValues[4], productId];
      console.log(params)
      database.transaction((tx) => {
          console.log("About to execute")
          tx.executeSql(query, params, (_, result) => {
              console.log("Edited Stock");
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
                  isSoldOut : updatedValues[3],
                  idGroup : 2,
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

    const printStock = () => {
      database.transaction((tx) => {
          // Lógica para insertar datos en la base de datos.
          tx.executeSql('SELECT * FROM [Product] WHERE idGroup = 1',[], (_, result) => {
              // Manejar el resultado de la inserción si es necesario.
              console.log(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
          tx.executeSql('SELECT * FROM [Pack]', [], (_, result) => {
            // Manejar el resultado de la inserción si es necesario.
            console.log(result.rows._array)
          },
          (_,result) => {
              console.log(result)
              return false;
          });
      });
    };

    // Order
    const readOrders = (callback: (data: any[]) => void) => {
          var query = `SELECT [Order].id AS id, [Order].price, [Order].orderTime,
                    GROUP_CONCAT(OrderDetail.idProd) AS products,
                    GROUP_CONCAT(OrderDetail.ammount) AS ammounts
            FROM [Order]
            INNER JOIN OrderDetail ON [Order].id = OrderDetail.idOrder
            GROUP BY [Order].id
            ORDER BY [Order].orderTime DESC;`
          database.transaction((tx) => {
              // Lógica para insertar datos en la base de datos.
              tx.executeSql(query, [], (_, result) => {
                  // Manejar el resultado de la inserción si es necesario.
                  console.log(result.rows._array)
                  callback(result.rows._array)
              },
              (_,result) => {
                  console.log(result)
                  return false;
              });
          });
    };

    const printOrders = () => {
      console.log("Printing")
          var query = `SELECT [Order].id AS id, [Order].price, [Order].orderTime,
                    GROUP_CONCAT(OrderDetail.idProd) AS products,
                    GROUP_CONCAT(OrderDetail.ammount) AS ammounts
            FROM [Order]
            INNER JOIN OrderDetail ON [Order].id = OrderDetail.idOrder
            GROUP BY [Order].id; `
          database.transaction((tx) => {
              // Lógica para insertar datos en la base de datos.
              tx.executeSql(query, [], (_, result) => {
                  // Manejar el resultado de la inserción si es necesario.
                  console.log(result.rows._array)
              },
              (_,result) => {
                  console.log(result)
                  return false;
              });
          });
    };
  
    const createOrder = (price, items, callback) => {
        // items es [[id, [amm,{info}]],...]
        console.log("Creating Order")
        var query = `INSERT INTO [Order] VALUES (NULL, ?, datetime('now', 'localtime'))`
        database.transaction((tx) => {
            // Lógica para insertar datos en la base de datos.
            tx.executeSql(query, [price], (_, result) => {
                console.log("Created Order")
                // Manejar el resultado de la inserción si es necesario.
                console.log(result)
                const newOrderId = result.insertId; // Obtén el ID del grupo recién creado
                // Crea el nuevo grupo con los datos que desees
                
              if (items && items.length > 0 && newOrderId >= 0) {
                console.log("Adding Detail too")
                query = `INSERT INTO [OrderDetail] (idOrder, ammount, idProd) VALUES (?, ?, ?)`;
                var params = [newOrderId, items[0][1][0], items[0][0]];
                var b = false;

                items.forEach(element => {
                  if (b) {
                    params.push(newOrderId, element[1][0], element[0]);
                    query += `, (?, ?, ?)`; // Agrega placeholders adicionales a la sentencia SQL
                  } else {
                    b = true;
                  }
                });

                console.log(params);

                tx.executeSql(query, params, (_, result) => {
                  // Manejar el resultado de la inserción si es necesario.
                  console.log(result);
                  const newDetails = result.insertId; // Obtén el ID del grupo recién creado
                  // Crea el nuevo grupo con los datos que desees
                  if (newDetails) {
                    callback();
                  }
                }, (_, result) => {
                  console.log(result);
                  return false;
                });
              }
              else {
                callback()
              }
            },
            (_,result) => {
                console.log(result)
                return false;
            });
        });
    };

    const deleteOrder = (orderId, callback: () => void) => {
      const query = `DELETE FROM [OrderDetail] WHERE idOrder=(?)`;
      const query2 = `DELETE FROM [Order] WHERE id=(?)`;
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [orderId],
          (tx, result) => {
            // Manejar el resultado de la consulta
            const rows = result.rows._array;
            console.log(rows)
            db.transaction((tx) => {
              tx.executeSql(
                query2,
                [orderId],
                (tx, result) => {
                  // Manejar el resultado de la consulta
                  const rows = result.rows._array;
                  console.log(rows)
                  callback()
                },
                (error) => {
                  console.error("Error al ejecutar la consulta:", error);
                  return false;
                }
              );
            });
          },
          (error) => {
            console.error("Error al ejecutar la consulta:", error);
            return false;
          }
        );
      });
    };

    // SoldOut
    const printSoldOut = () => {
      console.log("Printing")
      console.log("Printing")
          var query = `SELECT [Product].name AS name, [SoldOut].isSoldOut, [SoldOut].soldOutTime as soldOutTime
            FROM [SoldOut]
            INNER JOIN [Product] ON [SoldOut].idProd = [Product].id
            ORDER BY [SoldOut].soldOutTime DESC; `
          database.transaction((tx) => {
              // Lógica para insertar datos en la base de datos.
              tx.executeSql(query, [], (_, result) => {
                  // Manejar el resultado de la inserción si es necesario.
                  console.log(result.rows._array)
              },
              (_,result) => {
                  console.log(result)
                  return false;
              });
          });
    };
    const registerSoldOutChange = (id, isSoldOut, callback : () => void) => {
      console.log("Register SoldOut");
      const query = `
          UPDATE [Product]
          SET isSoldOut = ?
          WHERE id = ?`;
      const query2 = `INSERT INTO [SoldOut] VALUES (NULL, ?, ?, datetime('now', 'localtime'))`;
      const params = [isSoldOut, id];
      database.transaction((tx) => {
          tx.executeSql(query, params, (_, result) => {
              console.log("Edited Product");
              // Puedes manejar el resultado de la edición si es necesario.
              console.log(result);
              db.transaction((tx) => {
                tx.executeSql(
                  query2,
                  [id, isSoldOut],
                  (tx, result) => {
                    console.log("Callback")
                    console.log(result)
                    callback();
                  },
                  (error) => {
                    console.error("Error al ejecutar la consulta:", error);
                    return false;
                  }
                );
              });
          },
          (_, result) => {
              console.log("Execute Error")
              console.log(result);
              return false;
          });
      }, (error) => {console.log(error)});
    }

  
    const getGroupItemsBySaga = (idGroup, callback : (data:any) => void) => {
      database.transaction((tx) => {
        // Lógica para insertar datos en la base de datos.
        tx.executeSql(`SELECT * FROM [Product] WHERE idGroup = ?`,[idGroup], (_, result) => {
            // Manejar el resultado de la inserción si es necesario.
            var sagas = {}
            result.rows._array.forEach(element => {
              if (!sagas[element.idSaga]) sagas[element.idSaga] = []
              sagas[element.idSaga].push(element)
            });
            console.log(sagas)
            callback(sagas)
        },
        (_,result) => {
            console.log(result)
            return false;
        });
    });
    };

    const getSagasDict = (callback : (data:any) => void) => {
      database.transaction((tx) => {
        // Lógica para insertar datos en la base de datos.
        tx.executeSql(`SELECT * FROM [Saga]`,[], (_, result) => {
            // Manejar el resultado de la inserción si es necesario.
            console.log(result.rows)
            var sagas = {}
            result.rows._array.forEach(element => {
              if (!sagas[element.id]) sagas[element.id] = {name : element.name, color : element.color}
            });
            console.log(sagas)
            callback(sagas)
        },
        (_,result) => {
            console.log(result)
            return false;
        });
    });
    };
    
  return (
    <DatabaseContext.Provider value={{ database, fetchData, getAllTables, printTableColumns, deleteItem, getButtonsWithPacks,
      readPublicGroups, readPublicGroupsAndDict, createGroup, updateGroup, checkGroupDelete,
      readAllProducts, createProduct, updateProduct, cloneProduct, getMostSold, searchProduct, getProdNames, checkProductDelete, checkAdminDelete, getMostSoldWithPacks,
      readAllSagas, readAllSagasAndDict, createSaga, updateSaga, checkSagaDelete,
      readAllPacks, createPack, updatePack, printPacks, deletePack,
      readAllStock, createStock, updateStock, printStock,
      readOrders, createOrder, deleteOrder, printOrders,
      printSoldOut, registerSoldOutChange,
      getGroupItemsBySaga, getSagasDict }}>
      {children}
    </DatabaseContext.Provider>
  );
};