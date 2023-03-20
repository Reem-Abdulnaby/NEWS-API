const express=require('express')
const router=express.Router()
const News=require('../model/news')
const auth=require('../middelware/auth')
const multer=require('multer')

router.post('/news',auth,async(req,res)=>{           //add news by spicfic user
   try{
    const news = new News({...req.body,reporter:req.user._id})
    await news.save()
    res.status(200).send(news)
   }
   catch(e){
       res.status(400).send(e)
   }
})
router.get('/newsall',async(req,res)=>{     //get all
    try{
        const news= await News.find({})
        res.status(200).send(news)

    }
    catch(e){
        res.status(500).send(e.message)
    }
})
router.get('/news/:id',auth,async(req,res)=>{      //spcific user get own new by id
    try{
    const id=req.params.id
    const news= await News.findOne({_id:id,reporter:req.user._id})
    if(!news){
    return res.status(404).send('unable to found')
    }
    res.status(200).send(news)
 } 
 catch(e){
   
    res.status(500).send(e)
   
       
   }
})
router.patch('/news/:id',auth,async(req,res)=>{               //specific user edit own news by id
    try{
        const id=req.params.id
        const news=await News.findOneAndUpdate({_id:id,reporter:req.user._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
            return res.status(404).send('unable to found')
            }
            res.status(200).send(news)
    }
    catch(e){
   
        res.status(500).send(e)
       
           
       }
})
router.delete('/news/:id',auth,async(req,res)=>{     //user delete own new by id
      try{
        const id=req.params.id
        const news = await News.findOneAndDelete({_id:id,reporter:req.user._id})
        
        if(!news){
            return res.status(404).send('unable to found')
            }
            res.status(200).send(news)
    }
    catch(e){
   
        res.status(500).send(e)
       
           
       }

})


router.get('/reporternew/:id',auth, async(req,res)=>{           //get reporter of new
    try{
        const id=req.params.id
     const news= await News.findOne({_id:id,reporter:req.user._id})
     if(!news){
        return res.status(404).send('unable to found')
     }
    await news.populate("reporter")
    res.status(200).send(news.reporter)
    }
    catch(e){
   
        res.status(500).send(e)
       
           
       }
})
router.get('/news',auth,async(req,res)=>{            //user get all own news
   try{
       await req.user.populate('news')
       res.status(200).send(req.user.news)
       
   }
   catch(e){
    res.status(500).send(e)
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
router.post('/news/avatar/:id',auth,uploads.single('avatar'),async(req,res)=>{     //add image for specific new by id
    try{
       const id=req.params.id
        const news= await News.findOne({_id:id,reporter:req.user._id})
        if(!news){

            return res.status(404).send('unable to found')
        }
        
        news.pic=req.file.buffer
       await news.save()
       res.send()
    }
       catch(e){
        res.status(500).send(e)
    }
})
module.exports=router

