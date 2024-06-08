const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busname: {
    type: String,
    required: true,
  },
  busno: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true
  
  },
  to: {
    type: String,
    required: true
   
  },
  Dtime: {
    type: String,
    required: true,
  },
  Atime: {
    type: String,
    required: true,
  },
  Jdate: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsBooked:[Object],
  seat:[],
  status: {
    type: String,
    default: "Yet to start",
  } 
});



const Busess = new mongoose.model('Busess',busSchema )
module.exports = Busess