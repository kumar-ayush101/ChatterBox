const jwt=require('jsonwebtoken')
const dotenv = require('dotenv');
const User=require('../models/User')
dotenv.config({
  path: '../.env',
})
JWT_SECRET = process.env.JWT_SECRET
console.log(JWT_SECRET)

const authenticate=async (req,res,next)=>{
    const token=req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
     try {
    const decoded = jwt.verify(token, `${JWT_SECRET}`); 
    req.user = await User.findById(decoded.userId);
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports = authenticate;