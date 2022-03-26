const mongoose=require('mongoose')
const Reporter = require('./reporter')
const timestamps = require('mongoose-timestamp');
const newsSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    pic:{
        type:Buffer
    },
    
    reporter:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:Reporter
    },
})

newsSchema.plugin(timestamps)

const News=mongoose.model('news',newsSchema)
module.exports=News