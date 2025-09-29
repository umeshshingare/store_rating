const db = require("../configuration/db");

exports.getStoreRatings = async (req, res) => {
  try {
    // Find store owned by this user
    const [storeRows] = await db.query("SELECT * FROM stores WHERE owner_id = ?", [req.user.id]);

    if (storeRows.length === 0) {
      return res.json({ message: "You don’t own any store yet" });
    }

    const store = storeRows[0];

    // Get average rating
    const [[{ avgRating }]] = await db.query(
      "SELECT IFNULL(AVG(rating),0) AS avgRating FROM ratings WHERE store_id = ?",
      [store.id]
    );

    // Get list of users who rated
    const [ratings] = await db.query(`
      SELECT u.name, u.email, r.rating 
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `, [store.id]);

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      avgRating,
      ratings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
