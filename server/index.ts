import express from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/database";
import router from "./router";
import cors from 'cors'
import { ShipmentStatus } from "./models/ShipmentStatus";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}))


connectDB();

 ShipmentStatus.sync({
  force: true
})
sequelize.sync(
  // {force:true}
).then(() => {
  console.log("📦 MySQL Database synchronized!");
});


app.use("/api", router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

