const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded._id)
        const user = await User.findOne({_id: decoded._id,'tokens.token':token})

        if(!user){
            throw new Error('Error')
        }
        req.token= token
        req.user= user

        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports=auth