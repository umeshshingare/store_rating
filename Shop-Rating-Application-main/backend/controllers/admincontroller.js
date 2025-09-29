const db = require("../configuration/db");
const bcrypt = require("bcryptjs");

// Add new user (admin or normal)
exports.addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!["admin", "user", "store_owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, address, password, role) VALUES (?,?,?,?,?)",
      [name, email, address, hashedPassword, role]
    );

    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new store
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?,?,?,?)",
      [name, email, address, owner_id || null]
    );

    res.json({ message: "Store added successfully" });
  } catch (err) {
    console.error("Error adding store:", err);  
    res.status(500).json({ error: err.message });
  }
};

// Dashboard summary
exports.dashboard = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[{ totalStores }]] = await db.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[{ totalRatings }]] = await db.query("SELECT COUNT(*) AS totalRatings FROM ratings");

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
      console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get users with filter
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let query = `SELECT u.id, u.name, u.email, u.address, u.role, 
    
    case When u.role='store_owner' then (Select cast(IFNULL(AVG(r.rating),0) as decimal(2,1)) from stores s
    left join ratings r on s.id=r.store_id where s.owner_id=u.id)
    else null end as rating
    FROM users u WHERE 1=1`;
    let params = [];

    if (name) { query += " AND name LIKE ?"; params.push(`%${name}%`); }
    if (email) { query += " AND email LIKE ?"; params.push(`%${email}%`); }
    if (address) { query += " AND address LIKE ?"; params.push(`%${address}%`); }
    if (role) { query += " AND role = ?"; params.push(role); }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get stores with filter
exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    let query = `
      SELECT s.id, s.name, s.email, s.address,
      IFNULL(AVG(r.rating),0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    let params = [];

    if (name) { query += " AND s.name LIKE ?"; params.push(`%${name}%`); }
    if (email) { query += " AND s.email LIKE ?"; params.push(`%${email}%`); }
    if (address) { query += " AND s.address LIKE ?"; params.push(`%${address}%`); }

    query += " GROUP BY s.id";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
