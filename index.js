
const express = require('express')

//

const connectDB=require("./db/connection");

const routeAuth = require("./routes/auth");
const routeContacts = require("./routes/contact");
const routeUser = require("./routes/user");

//
const dotenv = require('dotenv')
//
const cors = require("cors");
//
dotenv.config()
//
const corsOptions = {
  origin: ["https://gestionnaire-contacts-nextjs-2.vercel.app", "http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  exposedHeaders: 'set-cookie',
};

const app = express()
app.use(cors(corsOptions));
//
app.use(express.urlencoded({ extended: true }))
//
app.use(express.json())

//
const port = process.env.PORT

//
app.use("/api/auth", routeAuth)
app.use("/api/v1", routeContacts)
app.use("/api/v1", routeUser)
app.get('/', (req, res) => {
  res.send(`Backend app for contacts's managment`)
})
connectDB(process.env.DB_URL, (erreur) => {
  if (erreur) {
    process.exit(-1)
  } else {
    app.listen(port || 8091, () => {
      //console.log("Backend app for contacts's managment" + port)
    })
  }
})
module.exports = app
