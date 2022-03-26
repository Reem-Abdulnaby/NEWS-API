const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const timestamps = require('mongoose-timestamp');

const reporterSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        trim:true,
        required:true
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            let password=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
            if(!password.test(value)){
                throw new Error('password most contain apper and lower case at least on special character and numbers')
            
        }

    }
},
    phone:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isMobilePhone(value,['ar-EG'])){
                throw new Error('Phone number is invalid')
                
            }
        }
    },
    pic:{
        type:Buffer
    },
   tokens:[
        {
        type:String,
        required:true
        }
    ]
   })


reporterSchema.pre('save',async function(){
    const reporter=this
    if(reporter.isModified('password'))
        reporter.password=await bcryptjs.hash(reporter.password,8)
    
})

reporterSchema.methods.generateToken=async function(){
    const reporter=this
    const token=jwt.sign({_id:reporter._id},process.env.SECRETKEY)
    reporter.tokens=reporter.tokens.concat(token)
      await reporter.save()
    return token

}
reporterSchema.statics.LogIn= async function(mail,pass) {
   const reporter=await Reporter.findOne({email:mail})
   if(!reporter){
       throw new Error(' password or email is wrong unable to login')
   }
   const isMatch =await bcryptjs.compare(pass,reporter.password)
   if(!isMatch){
    throw new Error(' password or email is wrong unable to login')
   }
   return reporter
}
reporterSchema.methods.toJSON=function(){
    const reporter=this
    const userObject=reporter.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}
reporterSchema.virtual('news',{
    ref:'news',
    localField:'_id',
    foreignField:'reporter'

})
reporterSchema.plugin(timestamps)



 



const Reporter=mongoose.model('reporters',reporterSchema)
 module.exports=Reporter
     
 
