const express = require('express')
const Evidence = require('../models/evidence')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const { ObjectId } = require('bson')
const router = new express.Router()

router.get('/evidences',auth, async (req, res) => {
    try {

        // const evidences = await Evidence.find({rid: req.user._id.toString()}).sort({_id: -1})
        // var p = new Promise(function(resolve, reject) {
        // console.log(evidences)
        // evidences.forEach(async(value,index)=>{
        //     const product =await Product.findOne({_id: ObjectId(value.productId)})
        //     arr.push(product)
        // })
        //   });
        var arr = new  Array()
        const evidences = await Evidence.find({rid: req.user._id.toString()}).sort({_id: -1})
        
     res.status(200).send({
            success: true,
            data: evidences
        })
        // p.then(function() {
        //     console.log("Hello "+ arr[0])
        // res.status(200).send({
        //     success: true,
        //     data: arr
        // })
        //   });

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

// router.get('/product/miniview', async (req, res) => {
//     try {
//         const products = await Product.find({}).sort({_id: -1}).limit(5)
//         res.status(200).send({
//             success: true,
//             data: products
//         })
//     } catch (e) {
//         res.status(400).send(
//             {
//                 success: false,
//                 data: {}
//             }
//         )
//         console.log(e)
//     }
// })

// router.get('/myproducts',auth ,async (req, res) => {
//     try {
//         const products = await Product.find({uid: req.user._id}).sort({_id: -1})
//         res.status(200).send({
//             success: true,
//             data: products
//         })
//     } catch (e) {
//         res.status(400).send(
//             {
//                 success: false,
//                 data: {}
//             }
//         )
//         console.log(e)
//     }
// })

router.post('/evidence/send',auth,async(req, res)=>{
    console.log(req.body)
    const evidences = new Evidence(req.body)
    evidences.rid =req.user._id
    try {
        await evidences.save()
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





module.exports= router