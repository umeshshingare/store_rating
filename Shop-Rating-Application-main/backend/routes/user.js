const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getStores,
  addOrUpdateRating
} = require("../controllers/userController");

const router = express.Router();

router.get("/stores", protect(["user"]), getStores);
router.post("/rate", protect(["user"]), addOrUpdateRating);

module.exports = router;
