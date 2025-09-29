require('dotenv').config();
const express = require('express');
const cors = require('cors');

const auth=require('./routes/auth');
const admin=require('./routes/admin');
const userRoutes = require('./routes/user');
const ownerRoutes = require("./routes/owner");
const store=require("./routes/owner");

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware

app.use(express.json());
app.use(cors());
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/store", store);


// Start the server     
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
