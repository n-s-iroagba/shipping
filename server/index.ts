import express from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/database";
import router from "./router";
import cors from 'cors'
import { seedDatabase } from "./seed";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}))


connectDB();


sequelize.sync(
  {force:true}
).then(() => {
  console.log("📦 MySQL Database synchronized!");
  seedDatabase()
});


app.use("/api", router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

