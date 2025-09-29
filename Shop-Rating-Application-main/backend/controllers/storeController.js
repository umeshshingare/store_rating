const db = require("../configuration/db");

// Get all stores for a logged-in store owner
exports.getMyStores = async (req, res) => {
  const owner_id = req.user.id; // from JWT middleware
  try {
    const [stores] = await db.execute(
      `
      SELECT s.id, s.name, s.email, s.address,
             CAST(IFNULL(AVG(r.rating),0) AS DECIMAL(3,2)) AS overallRating,
             COUNT(r.id) AS totalRatings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
      GROUP BY s.id
      `,
      [owner_id]
    );
    console.log("Store owner id from token:", req.user.id);


    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get detailed ratings for one store
exports.getStoreRatings = async (req, res) => {
  const store_id = req.params.id;
  const owner_id = req.user.id;

  try {
    // First verify store belongs to this owner
    const [store] = await db.execute("SELECT * FROM stores WHERE id = ? AND owner_id = ?", [store_id, owner_id]);
    if (store.length === 0) return res.status(403).json({ message: "Access denied" });

    // Get ratings with user info
    const [ratings] = await db.execute(
      `SELECT r.rating, u.name AS userName, u.email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store_id]
    );

    res.json(ratings);
  } catch (err) {
    console.error("Error fetching ratings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
