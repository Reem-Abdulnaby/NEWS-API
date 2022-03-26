const jwt=require('jsonwebtoken')
const Reporter=require('../model/reporter')
const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.SECRETKEY)
        const reporter=await Reporter.findOne({_id:decode._id,tokens:token})
        if(!reporter){
        throw new Error('')
        }
        req.user=reporter
        req.token=token
       next()
        
    }
    catch(e){
        res.status(401).send('please athenticate')
    }

}
module.exports=auth