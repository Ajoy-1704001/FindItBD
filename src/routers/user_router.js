const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/register',async(req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            success: true,
            message:'Account Created Successfully',
            _token: token,
            data: user
        })
    } catch (error) {
        console.log(error._message)
        res.status(400).send({
            success: false,
            message: error._message,
            _token:'',
            data:{}
        })
    }
})
router.post('/login',async(req,res)=>{
    const pro =req.body.provider
    try {
        var user = null;
        if(pro==='google'){
            user = await User.findOne({email: req.body.email,provider: req.body.provider})
        }else{
            user = await User.findByCredentials(req.body.email,req.body.password)
        }
        console.log('login'+user)
        const token = await user.generateAuthToken()
        res.send({
            success: true,
            message:'Login Successful',
            _token: token,
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(
            {
                success: false,
                message:'Login Failed',
                _token:'',
                data:{}
            }
        )
    }
})



router.post('/me/logout',auth, async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send({
            success: true,
            message: "Logged out successfully!!!"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Logged out failed"
        })
    }
})

router.post('/me/image',auth,async(req,res)=>{
    const user = await User.findById(req.user._id)
    user.image=req.body['image']
    console.log(user.image);
    await user.save()
    res.send({
        success: true
    })
})

router.patch('/me/update',auth,async(req,res)=>{
    const user = await User.findById(req.user._id)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','address','mobile']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send({
            success: true,
        })
    } catch (e) {
        res.status(400).send({
            success: false,
        })
    }
})
router.get('/me', auth, async (req, res) => {
    res.send({
        success: true,
        data: req.user
    })
})

router.patch('/me/changepass',auth,async(req,res)=>{
    const user = await User.findById(req.user._id)
        const isMatch = await bcrypt.compare(req.body['current_password'],user.password)
        console.log(isMatch)
        if(!isMatch){
                return res.status(400).send({
                    success:false,
                    message:'Password didn\'t match',
                    data:{}
                })
            }

        user.password=req.body['new_password']
        await user.save()

        if (!user) {
            return res.status(400).send({
                success: false,
                message:"Failed, Try again",
                data:{}
            })
        }
        res.send({
            success:true,
            message:'Password Changed',
            data:{}
        })

})
module.exports= router