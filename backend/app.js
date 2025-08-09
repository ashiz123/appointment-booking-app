import express from 'express';
const app = express();
const port = 3000;
import { connect, getDb } from './src/config/db.js';
import userRouter from './src/routes/userRoute.js';
//setup morgan. Morgan is already installed
app.use(express.json()); //if you sending request data using postman
//Mongo connection setup
async function main(){
  try {
    await connect();
    console.log("MongoDB connection successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

main();

app.get('/', (req, res) => {
  res.send('start project now')
})

app.use('/users', userRouter);






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
