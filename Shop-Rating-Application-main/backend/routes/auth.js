const routes=require('express').Router();
const {register,login}=require('../controllers/authcontroller');
const { updatePassword } = require("../controllers/authcontroller");
const { protect } = require("../middleware/authMiddleware");

routes.post('/register',register);
routes.post('/login',login);
routes.put('/update-password', protect(), updatePassword);
module.exports=routes;