const express=require('express')

const router =new express.Router()



const authmiddleware=require('../middleware/middleware');


const{ userRegister, userLogin, addbus, getallbus, bookapi, getbos, busearch, cancelticket, ticketgen, tableticket, selticket  }=require('../controllers/logic');



router.post('/user/register',userRegister)

router.post('/user/login',userLogin)

router.post('/admin/addbus',addbus )

router.get('/user/buss',authmiddleware,getallbus)

router.get('/user/seat/:id',authmiddleware,getbos)

router.post('/user/book',authmiddleware,bookapi)

router.post('/user/search',busearch)

router.post('/user/cancel',authmiddleware,cancelticket)

router.post('/user/ticket',authmiddleware,ticketgen)

router.post('/user/tabletic',authmiddleware,tableticket)

// router.post('/user/seltic',authmiddleware,selticket)

module.exports=router