const express = require("express");
const {
  addUser,
  addStore,
  dashboard,
  getUsers,
  getStores
} = require("../controllers/admincontroller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add-user", protect(["admin"]), addUser);
router.post("/add-store", protect(["admin"]), addStore);
router.get("/dashboard", protect(["admin"]), dashboard);
router.get("/users", protect(["admin"]), getUsers);
router.get("/stores", protect(["admin"]), getStores);

module.exports = router;
