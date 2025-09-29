const db = require("../configuration/db");

// Get all stores with ratings
exports.getStores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.name, s.address,
        IFNULL(AVG(r.rating),0) AS overallRating,
        (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id LIMIT 1) AS userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit a rating
exports.addOrUpdateRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;  // from JWT middleware

  try {
    // Check if rating exists
    const [existing] = await db.execute(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [user_id, store_id]
    );

    if (existing.length > 0) {
      // Update rating
      await db.execute(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, user_id, store_id]
      );
      return res.json({ message: "Rating updated successfully" });
    } else {
      // Insert new rating
      await db.execute(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [user_id, store_id, rating]
      );
      return res.json({ message: "Rating added successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
