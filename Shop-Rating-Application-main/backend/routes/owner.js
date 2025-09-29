const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getStoreRatings } = require("../controllers/ownerController");
const storeController = require("../controllers/storeController");

const router = express.Router();

// store_owner role only
router.get("/dashboard", protect(["store_owner"]), getStoreRatings);
router.get("/my-stores", protect(["store_owner"]), storeController.getMyStores);
router.get("/:id/ratings", protect(["store_owner"]), storeController.getStoreRatings);


module.exports = router;
