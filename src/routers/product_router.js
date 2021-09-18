const express = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}).sort({_id: -1})
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})

router.get('/product/miniview', async (req, res) => {
    try {
        const products = await Product.find({}).sort({_id: -1}).limit(5)
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})

router.get('/myproducts',auth ,async (req, res) => {
    try {
        const products = await Product.find({uid: req.user._id}).sort({_id: -1})
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})
router.get('/product/miniview', async (req, res) => {
    try {
        const products = await Product.find({}).sort({_id: -1}).limit(5)
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})

router.get('/products/:id' ,async (req, res) => {
    try {
        const products = await Product.findOne({_id: req.params.id})
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})

router.get('/products/delete/:id' ,async (req, res) => {
    try {
        const products = await Product.findByIdAndDelete({_id: req.params.id})
        res.status(200).send({
            success: true,
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
            }
        )
        console.log(e)
    }
})

router.post('/product/post',auth,async(req, res)=>{
    console.log(req.body)
    const products = new Product(req.body)
    try {
        products.uid = req.user._id
        products.u_name = req.user.name
        products.u_image = req.user.image
        await products.save()
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})

router.get('/products/search/:query' ,async (req, res) => {
    console.log(req.params.query)
    try {
        const regex = new RegExp(req.params.query,'i')
        const products = await Product.find({name:regex});
        res.status(200).send({
            success: true,
            data: products
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})

router.get('/advancesearch/:query&:type' ,async (req, res) => {
    console.log(req.params.query)
    console.log(req.params.type)
    try {
        if(req.params.type=='Name'){
            const regex = new RegExp(req.params.query,'i')
            const products = await Product.find({name:regex});
            res.status(200).send({
                success: true,
                data: products
            })
        }else if(req.params.type=='IMEI'||req.params.type=='Identication No'){
            const products = await Product.find({imei:req.params.query});
            res.status(200).send({
                success: true,
                data: products
            })
        }else if(req.params.type=='Model No'){
            const products = await Product.find({modelNo:req.params.query});
            res.status(200).send({
                success: true,
                data: products
            })
        }
        
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {}
            }
        )
        console.log(e)
    }
})



module.exports= router