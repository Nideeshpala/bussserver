const User = require("../models/user")
const Busess = require("../models/busmodel")


// register
// ----------------
userRegister = async (req, res) => {


  const { sname, email, password, gender, dob } = req.body

  // console.log(dob);



  if (!sname || !email || !password || !gender || !dob) {
    res.status(400).json("all inputs are required")
  }


  try {
    const preUser = await User.findOne({ email })
    if (preUser) {

      res.status(403).json("user already present")
    }
    else {

      const newuser = new User({ sname, email, password, gender, dob })
      await newuser.save()
      res.status(200).json(newuser)
    }
  }
  catch {
    res.status(400).json("hailogicerror")
  }

}

// login
// ==========

userLogin = async (req, res) => {
  const { email, password } = req.body
  console.log(email, password);
  const userlo = await User.findOne({ email })
  console.log(userlo);
  if (userlo) {
    if (password == userlo.password) {
      res.status(200).json(userlo)
    }
    else {
      res.status(400).json("password doesn't match")
    }

  }
  else {
    res.status(403).json("logic error")
  }


}

// add bus
// -----------

addbus = async (req, res) => {
  const { busname, busno, from, to, Dtime, Atime, Jdate, capacity, price } = req.body

  // console.log(busname, busno, from, to, Dtime, Atime, Jdate, capacity, price);

  if (!busname || !busno || !from || !to || !Dtime || !Atime || !Jdate || !capacity || !price) {
    res.status(400).json("all inputs are required")
  }
  try {
    const prevbus = await Busess.findOne({ busno })


    if (prevbus) {
      res.status(403).json("this bus is already in the database")
    }
    else {
      const newbus = new Busess({ busname, busno, from, to, Dtime, Atime, Jdate, capacity, price })
      await newbus.save()

      res.status(200).json(newbus)
    }
  }
  catch {
    res.status(403).json("logic error")
  }
}


// get all buss
// ---------------

getallbus = async (req, res) => {



  // query = {
  //   from: { $regex: search, $options: "i" },
  //   // to: { $regex: search, $options: "i" },
  //   // date: { $regex: search, $options: "i" }

  // }

  try {
    const getalbus = await Busess.find()
    res.status(200).json(getalbus)
  }
  catch (err) {
    res.status(400).json(err)


  }
}

// get single bus
// ================
getbos = async (req, res) => {
  try {
      let { id } = req.params;
      id = id.substring(0, 24)
      const single = await Busess.findOne({ _id: id });

      console.log(id);
      console.log(single);

      if (single) {
          res.status(200).json(single);
      } else {
          res.status(400).json("Didn't find any data");
      }
  } catch (error) {
      console.error("Error fetching bus data:", error);
      res.status(500).json("Internal server error");
  }
};




// booking
// -----------


bookapi = async (req, res) => {
  const { sname, email, gender, busname, busno, from, to, price, sename, age } = req.body
  console.log(sname, email, gender);
  try {
    const user = await User.findOne({ email })
    console.log(user.sname);
    if (user) {

      user.ticket.push({ sname, email, gender, busname, busno, from, to, price, sename })
      user.save()


      console.log(user);
      res.status(200).json("ticket confirmed")
    }
    else {
      res.status(404).json("some datas are missing")
    }
  }
  catch (err) {

    res.status(400).json(err)

  }


}

module.exports = { userRegister, userLogin, addbus, getallbus, getbos, bookapi }

