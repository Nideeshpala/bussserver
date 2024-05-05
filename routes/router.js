const express=require('express')

const router =new express.Router()


const{ userRegister, userLogin, addbus, getallbus,getbos, bookapi  }=require('../controllers/logic')


router.post('/user/register',userRegister)

router.post('/user/login',userLogin)

router.post('/admin/addbus',addbus )

router.get('/user/buss',getallbus)

router.get('/user/seat/:id',getbos)

router.post('/user/book',bookapi)

module.exports=router