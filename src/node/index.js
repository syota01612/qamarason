const express = require("express");
const app = express();
const port = 2760;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added to parse JSON requests

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_2760", // PostgreSQLのユーザー名に置き換えてください
  host: "db",
  database: "crm_2760", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_2760", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// DetailのGETエンドポイント
// DetailのGETエンドポイント
app.get("/customer-detail", async (req, res) => {
  try {
    const customerId = req.query.customer_id; // クエリパラメータとして customer_id を取得

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const customerData = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [customerId]
    );

    if (customerData.rows.length > 0) {
      res.json(customerData.rows);
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (err) {
    console.error(err); // Log the error details
    res.status(500).json({ error: "Internal server error" });
  }
});


// DetailのDELETEエンドポイント
app.delete("/customer-delete", async (req, res) => {
  try {
    const customerId = req.query.customer_id;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const deleteResult = await pool.query(
      "DELETE FROM customers WHERE customer_id = $1 RETURNING *",
      [customerId]
    );

    if (deleteResult.rows.length > 0) {
      res.json({ success: true, deletedCustomer: deleteResult.rows[0] });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (err) {
    console.error(err); // Log the error details
    res.status(500).json({ error: "Internal server error" });
  }
});

// ... 既存のコード



app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});


// index.js

// 既存のコード...

// UpdateのPOSTエンドポイント
app.post("/update-customer", async (req, res) => {
  try {
    const customerId = req.query.customer_id;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const { companyName, industry, contact, location } = req.body;

    // ここにバリデーションのロジックを追加

    // バリデーションが成功した場合、データベースを更新
    const updateCustomer = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5 RETURNING *",
      [companyName, industry, contact, location, customerId]
  );
  

    if (updateCustomer.rows.length > 0) {
      res.json({ success: true, customer: updateCustomer.rows[0] });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (err) {
    console.error(err); // ログにエラーの詳細を記録
    res.status(500).json({ error: "Internal server error" });
  }
});

// 既存のコード...


app.use(express.static("public"));
