const { Client } = require('pg');
const { DB } = require('./config');

(async () => {

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id              INT               PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      first_name      VARCHAR(50),      
      last_name       TEXT,
      email           VARCHAR(50)       NOT NULL,
      password        TEXT              NOT NULL,
      created         TIMESTAMP,
      modified        TIMESTAMP
    );
  `

  const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name            VARCHAR(50)     NOT NULL,
      price           BIGINT          NOT NULL,
      category        VARCHAR(20)     NOT NULL,
      description     VARCHAR(50)     NOT NULL
    );
  `

  const ordersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      total_price     BIGINT          NOT NULL,
      status          VARCHAR(50)     NOT NULL,
      user_id         INT             NOT NULL,
      created         TIMESTAMP       NOT NULL,
      modified        TIMESTAMP       NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `

  const orderProductsTable = `
    CREATE TABLE IF NOT EXISTS order_product (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name            VARCHAR(50)     NOT NULL,
      description     VARCHAR(250)    NOT NULL,
      quantity        INT             NOT NULL,
      price           BIGINT          NOT NULL,
      created         TIMESTAMP       NOT NULL,
      order_id        INT             NOT NULL,
      product_id      INT             NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `

  const cartsTable = `
    CREATE TABLE IF NOT EXISTS carts (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      user_id         INT             NOT NULL,
      modified        DATE            NOT NULL,
      created         DATE            NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `

  const cartProductsTable = `
    CREATE TABLE IF NOT EXISTS cart_product (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      quantity        INT             NOT NULL,
      cart_id         INT             NOT NULL,
      product_id      INT             NOT NULL,
      FOREIGN KEY (cart_id) REFERENCES carts(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `

  try {
    const db = new Client({
      user: DB.DB_USER,
      host: DB.DB_HOST,
      database: DB.DB_DATABASE,
      password: DB.DB_PASSWORD,
      port: DB.DB_PORT
    });

    await db.connect();

    // Create tables on database
    await db.query(usersTable);
    await db.query(productsTable);
    await db.query(ordersTable);
    await db.query(orderProductsTable);
    await db.query(cartsTable);
    await db.query(cartProductsTable);

    await db.end();

  } catch(err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }

})();