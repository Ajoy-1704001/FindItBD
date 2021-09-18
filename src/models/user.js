const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        default: ''
    },
    mobile:{
        type: String,
        default:''
    },
    email:{
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new error('Can not contain password keyword')
            }
        }
    },
    image:{
        type: String,
        default:''
    },
    provider:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]
})
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    //delete userObject.tokens

    return userObject
}
userSchema.methods.generateAuthToken = async function(){
    const user = this
    console.log('login brother'+user)
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async(email, password)=>{
    const user = await User.findOne({email: email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports=User