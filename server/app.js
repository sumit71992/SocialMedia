const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const mainRoutes = require("./routes/mainRoutes");
const {MONGO_URI} = require("./keys");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(compression());
mongoose.connect(MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.connection.on("connected",()=>{
  console.log("Database Connected");
})
mongoose.connection.on("error",(error)=>{
  console.log("connecting error",error);
})

app.use(express.json());
app.use("/", mainRoutes);


app.listen(PORT, ()=>{
  console.log("Server running on", PORT);
})

module.exports = app;