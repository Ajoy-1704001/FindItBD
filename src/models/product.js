const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    uid:{
        type: String,
    },
    u_name:{
        type:String,
    },
    u_image:{
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
  fDistrict:{
      type: String,
      required: true,
  },
  fThana: {
    type: String,
    required: true,
},
fAddress:{
    type: String,
    required: true,
},
  pType:{
    type: String,
    required: true,
},
modelNo:{
    type: String,
    default:'',
}
 ,imei:{
    type: String,
    default:'',
 },
  color:{
    type: String,
    default:'',
  },fDate:{
    type: String,
    required: true
},
status:{
type: String,
required: true,
},
contact:{type: String,required:true},
img_link:{
    type: String,
    required: true
}}
)

const Product = mongoose.model('Product',productSchema)

module.exports = Product

