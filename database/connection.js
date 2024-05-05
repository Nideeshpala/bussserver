const mongoose=require('mongoose')

mongoose.connect(process.env.baseurl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("------ mongodb atlas connected ------");
}).catch((err)=>{
    console.log(` * * * * * mongodb connection error * * * * * ${err}`);
})