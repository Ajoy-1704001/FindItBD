const mongoose = require('mongoose')
const validator = require('validator')

const blogSchema = new mongoose.Schema({
    uid:{
        type: String,
    },
    u_name:{
        type: String,
    },
    u_image:{
        type: String,
    },
    text:{
        type: String,
        default: ''
    },
    images:[{
        image:{
            type: String,
        }
    }],
    react:{
        type: Number,
        default: 0
    },
    is_react:{
        type: Boolean,
        default:false
    },
    react_value:[{
        r_uid:{
            type: String,
        },
    }],
    comments:[{
        c_uid:{
            type: String,
        },
        c_uImage:{
            type: String,
        },
        c_uName:{
            type: String,
        },
        comment:{
            type: String,
        },
    },{ timestamps: true}],
},{timestamps:true}
)

const Blog = mongoose.model('Blog',blogSchema)

module.exports = Blog

