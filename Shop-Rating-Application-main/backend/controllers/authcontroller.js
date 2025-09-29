const db=require('../configuration/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.register=async(req,res)=>{
    const {name,email,password,address,role}=req.body;
    try{
         if (role === "admin") {
      return res.status(403).json({ message: "You cannot register as admin directly" });
    }
        if (!["user", "store_owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
        const hashedPassword=await bcrypt.hash(password,10);
        const [existingUser]=await db.execute('SELECT * FROM users WHERE email=?',[email]);
        if(existingUser.length>0){
            return res.status(400).json({message:'User already exists'});
        }
        await db.execute(
      "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, 'user')",
      [name, email, address, hashedPassword]
    );
        res.status(201).json({message:'User registered successfully'});
    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
        console.error(err);
    }
    }
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT id, name, email, password, address, role FROM users WHERE email=?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    
    

    // Ensure role has a valid value
    let userRole = "user"; // default fallback

    if (user.hasOwnProperty('role') && user.role !== null && user.role !== undefined && user.role !== '') {
      userRole = user.role;
      console.log("Using role from database:", userRole);
    } else {
      console.log("Role not found or empty in database, using default:", userRole);
      console.log("Database role value:", user.role);
    }

    console.log("Final role to use:", userRole);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    //  send user details including role
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    console.error(err);
  }
};
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
   alert("Current passwrd");
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
