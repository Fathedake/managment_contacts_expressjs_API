
const express = require('express') 

//
const { connect } = require("./db/connection");

//importation des routes
const routeAuth= require("./routes/auth");
const routeContacts= require("./routes/contact");
const routeUser= require("./routes/user");

//
const dotenv=require('dotenv')
//
const cors = require("cors");
//
const cookieSession = require("cookie-session");
//
//Charger les variables d'environnements
dotenv.config()
//Normalement ce sont les urls autorisés
//const front_url=require("./config/configFrontUrl")

//
//
const corsOptions = {
  //origin: true,
  origin:["https://gestionnaire-contacts-nextjs-2.vercel.app","http://localhost:3000","http://localhost:3001"],
  credentials: true,
  //exposedHeaders: 'set-cookie',
};

const app = express() 
app.use(cors(corsOptions));
//
app.use(express.urlencoded({extended:true}))
//
app.use(express.json())
//
//
console.log("Initialisation...")
app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], 
    maxAge: 2592000000,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
   // domain:"gestionnaire-contacts-nextjs-2.vercel.app",
  }),
);

app.enable('trust proxy');
/*app.use(
    cookieSession({
      name: "bezkoder-session",
      keys: ["COOKIE_SECRET"], // should use as secret environment variable
      httpOnly: false,
      maxAge: 2592000000,// 1mois en millisecondes
      sameSite: "none",
      domain:"gestionnaire-contacts-nextjs-2.vercel.app",
      secure: true,
      
    })
  );*/


//
const port=process.env.PORT

//
app.use("/api/auth",routeAuth)
app.use("/api/v1",routeContacts)
app.use("/api/v1",routeUser)
app.get('/',(req,res)=>{ 
  res.send(`<h5 style="color:green"> 
  Mon backend expressjs pour mon gestionnaire de contacts 2</h5>`) 
}) 
connect(process.env.DB_URL,(erreur)=>{
  if(erreur){
      console.log("Erreur lors de la connexion")
      process.exit(-1)
    }else{
      console.log("Connexion à la BD avec succès")
      app.listen(port || 8091,()=>{ 
        console.log('Mon backend expressjs pour mon gestionnaire de contacts'+port) 
    }) 
    }
  })
module.exports=app
