const express=require('express')
const router=express.Router()
const Reporter=require('../model/reporter')
const auth=require('../middelware/auth')
const multer=require('multer')

 

router.post('/reporter',async(req,res)=>{            //sign up
    try{
        const reporter= new Reporter(req.body)
        const token= await reporter.generateToken()
         await  reporter.save()

         res.status(200).send({reporter,token})
        
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
const uploads=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
        return cb(new Error('please upload image'))
        }
        cb(null,true)

    }
})
router.post('/reporter/image',auth,uploads.single("avatar"),async(req,res)=>{     //add  image
    try{
         req.user.pic=req.file.buffer
         await req.user.save() 
         res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.post('/reporter/login',async(req,res)=>{        //login
    try{
     const reporter= await Reporter.LogIn(req.body.email,req.body.password)
     const token=await reporter.generateToken()
     res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
router.get('/reporter/:id',auth,async(req,res)=>{                    //get by id
    try{
         const id=req.params.id
         const reporter=await Reporter.findById(id)
         if(!reporter){
            return res.status(404).send('unable to found this user')
           
         }
         res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
router.get('/profile',auth,async(req,res)=>{            //get user profile
    try{
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
router.get('/reporter',auth,async(req,res)=>{                  //get all users
    try{
          const reporter=await Reporter.find({})
          res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
router.patch('/reporter',auth,async(req,res)=>{               //edit by req.user
    try{
        const Updates=Object.keys(req.body)
      
    
       Updates.forEach((update)=>{req.user[update]=req.body[update]})
       await req.user.save()
        
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
router.delete('/reporter',auth,async(req,res)=>{                //delete by req.user
    try{
    req.user.remove()
    
     
    
  res.status(200).send(req.user)
}

    catch(e){
        res.status(500).send(e.message)
    }
})
router.delete('/reporter/logout',auth,async(req,res)=>{                 //logout
    try{
        req.user.tokens=req.user.tokens.filter((el)=>{
          return  el!==req.token

        })
        await req.user.save()
        res.send()
    }
    catch(error){
        res.status(500).send(error.message)
    }
})
router.delete('/logoutall',auth,async(req,res)=>{           //logout from all
    
        try{
            req.user.tokens=[]
    
            await req.user.save()
            res.send()
        }
        catch(error){
            res.status(500).send(error.message)
        }
    })
    router.delete('/reporter/delimage',auth,async(req,res)=>{           //delete image
        try{
           req.user.pic= ""
           await req.user.save()
           res.send()
         
        
      
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
    


module.exports=router