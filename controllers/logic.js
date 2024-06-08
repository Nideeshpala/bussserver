const User = require("../models/user")
const Busess = require("../models/busmodel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require("express");


// register
// ----------------
userRegister = async (req, res) => {
  const { name, email, password, gender, dob } = req.body;

  console.log(name, email, password, gender, dob);

  // try {
  // Check if any required fields are missing
  if (!name || !email || !password || !gender || !dob) {
    return res.status(400).json('All inputs are required');
  }

  // Check if user already exists with the provided email
  const preUser = await User.findOne({ email });
  if (preUser) {
    return res.status(403).json('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object
  const newUser = new User({ name, email, password: hashedPassword, gender, dob });
  await newUser.save();

  // Remove the hashed password from the response for security
  const userResponse = { ...newUser._doc };
  delete userResponse.password;

  res.status(200).json(userResponse);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json('Internal server error');
  // }
};

// login
// ==========

userLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    const userlo = await User.findOne({ email });

    if (!userlo) {
      return res.status(403).json('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, userlo.password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: userlo._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ userlo, token });
    } else {
      res.status(400).json('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error');
  }
};

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


  const getalbus = await Busess.find()
  res.status(200).json(getalbus)

  // res.status(400).json(err)


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
  const { name,email, gender, busname, busno, from, to, price, sename, age, busid, ticket_no } = req.body

  console.log(name, gender, busname, busno, from, to, price, sename, age, busid, ticket_no);

  if (!name || !email || !gender || !busname || !busno || !busid || !from || !to || !age || !sename || !price || !ticket_no) {
    res.status(400).json({ error: "All input fields are required." });
  }

  try {
    const user = await User.findOne({ email })
    const bus = await Busess.findOne({ _id: busid })
    console.log("bus", bus, "user", user);

    if (!user || !bus) {
      res.status(404).json({ error: "User or bus not found." });
    }
    else {
      
      user.ticket.push({ name, email,  gender, age, busname, busno, from, to, price, sename, ticket_no })
      bus.seatsBooked.push({ name, email, gender, age, busname, busno, from, to, price, sename, ticket_no })
      bus.seat.push(sename)

      await user.save();
      await bus.save();

      console.log(bus.seat);



      res.status(200).json(bus.seat);

    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
}


busearch = async (req, res) => {
  // try {
  const { from } = req.body
  console.log(from);



  // Build the query object

  //  



  // Find available buses
  const availablebus = await Busess.find(from);

  // Send the response back to the client
  res.status(200).json("");
  // } catch (error) {
  //   console.error("Error fetching buses:", error);
  //   res.status(500).json({ message: "Internal Server Error" });
  // }
};


cancelticket = async (req, res) => {
  const { ticket_no, email } = req.body;

  if (!ticket_no || !email) {
    return res.status(401).json("All inputs are required");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const ticket = user.ticket.find(t => t.ticket_no === ticket_no);

    console.log("Ticket:", ticket);

    if (!ticket) {
      return res.status(400).json("This ticket is already cleared");
    }

    const busname = ticket.busname;
    const buse = await Busess.findOne({ busname });

    console.log("Bus:", buse);

    if (!buse) {
      return res.status(400).json("Didn't find any bus");
    }

    console.log("Seat name to be removed:", ticket.sename);

    buse.seatsBooked = buse.seatsBooked.filter(t => t.ticket_no !== ticket_no);
    console.log("Updated seatsBooked:", buse.seatsBooked);

    buse.seat = buse.seat.filter(t => t !== ticket.sename);
    console.log(buse.seat);

    console.log("Updated seats:", buse.seat);

    await buse.save();
    console.log("Updated bus after save:", buse);

    // Assuming you want to remove the ticket
    user.ticket = user.ticket.filter(t => t.ticket_no !== ticket_no);
    await user.save();

    res.status(200).json(buse);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

ticketgen = async (req, res) => {
  try {
    console.log(req.body);

    const { id } = req.body;
    console.log('Received ID:', id);

    if (!id) {
      return res.status(400).json("User ID is required");
    }
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json("User not found");
    }

    if (user.ticket && user.ticket.length > 0) {
      const ticket = user.ticket[user.ticket.length - 1];
      console.log(ticket);
      return res.status(200).json(ticket);
    } else {
      return res.status(400).json("No ticket found");
    }
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

tableticket = async (req, res) => {

  const { id } = req.body
  const user = await User.findOne({ _id: id })
  console.log(user);

  const ticket = user.ticket
  try {
    if (user) {
      res.status(200).json(ticket)
    }
    else {
      res.status(400).json("no user found")
    }
  }
  catch (err) {
    res.status(400).json("na")
  }

}




selticket = async (req, res) => {

  const { ticket_no, id } = req.body

  console.log(ticket_no, id);

  const user = await User.findOne({ _id: id })

  const tickets=await User.findOne({ticket_no:user.ticket[ticket_no]})
  console.log(tickets);

 

  console.log(user);
  if (user && user.ticket && user.ticket[user.ticket[ticket_no]]) {
    if (tickets) {
      res.status(200).json(tickets)

    }
    else {
      res.status(400).json("ticket not found")
    }
  }
  else {
    res.status(400).json("na")
  }





}

module.exports = { userRegister, userLogin, addbus, getallbus, getbos, bookapi, busearch, cancelticket, ticketgen, tableticket }
