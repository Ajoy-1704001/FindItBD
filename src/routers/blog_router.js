const express = require('express')
const Blog = require('../models/blog')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/blog', auth, async (req, res) => {
    try {
        var arr= new Array()
        const blogs = await Blog.find({}).sort({_id: -1})
        blogs.forEach(element => {
            element.react_value.forEach(e => {
                if(e.r_uid==req.user._id){
                    element.is_react = true
                }
            });
        });
        res.status(200).send({
            success: true,
            data: blogs,
            
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data: {},
                reacts:{}
            }
        )
        console.log(e)
    }
})
router.post('/blog/post',auth,async(req, res)=>{
    console.log(req.body)
    const blogs = new Blog(req.body)
    try {
        blogs.uid = req.user._id
        blogs.u_name = req.user.name
        blogs.u_image = req.user.image
        if(req.body.images!=null){
            var i =req.body.images
            blogs.images = req.body.images
            // req.body.images.forEach(element => {
            //     blogs.images= blogs.images.concat({element})
            // });
        }
        await blogs.save()
        // console.log(blogs)
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

router.get('/blog/react/:id',auth,async(req, res)=>{
    console.log(req.body)
    const blogs = await Blog.findOne({_id: req.params.id, 'react_value.r_uid': req.user._id })
    try {
        if(blogs==null){
            var i =req.user._id
            const b = await Blog.findOne({_id: req.params.id })
            b.react_value = b.react_value.concat({r_uid:i})
            b.react = b.react+1
            await b.save()
            console.log('liked')
            res.status(200).send({
                success: true,
            })
        }else{
            var i =req.user._id
            const d = await Blog.findOne({_id: req.params.id })
            d.react_value = d.react_value.filter((value)=>{
                console.log(value)
                return value.r_uid!=req.user._id
            })
              d.react = d.react-1
              console.log('unliked')
              await d.save()
            
            res.status(200).send({
                success: true,
            })
        }
    } catch (e) {
        res.status(400).send(
            {
                success: false,
            }
        )
        console.log(e)
    }
})

router.post('/blog/comment/:id',auth,async(req, res)=>{
    console.log(req.body)
    const blogs = await Blog.findOne({_id: req.params.id})
    try {
        blogs.comments = blogs.comments.concat({
            c_uid: req.user._id,
            c_uImage: req.user.image,
            c_uName: req.user.name,
            comment: req.body.comment
        })
        await blogs.save()
        // console.log(blogs)
        res.status(200).send({
            success: true,
            data: blogs
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data:{}
            }
        )
        console.log(e)
    }
})
router.get('/blog/post/delete/:id',auth,async(req, res)=>{
    try {
        
        const blogs = await Blog.findByIdAndDelete({_id: req.params.id})
        res.status(200).send({
            success: true
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false
            }
        )
        console.log(e)
    }
})
router.get('/blog/comment/delete/:id',auth,async(req, res)=>{
    const blogs = await Blog.findOne({"comments._id": req.params.id})
    try {
        blogs.comments=blogs.comments.filter((element)=>{
            console.log(element)
            return element._id!=req.params.id
        })
        await blogs.save()
        // console.log(blogs)
        res.status(200).send({
            success: true,
            data: blogs
        })
    } catch (e) {
        res.status(400).send(
            {
                success: false,
                data:{}
            }
        )
        console.log(e)
    }
})




module.exports= router