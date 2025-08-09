import { registerUser, loginUser } from "../services/userServices.js";

export async function registerController(req, res){
  try{
    const result = await registerUser(req.body);
    res.status(200).json({
        message : "User registered succcessfully",
        user: result
    });
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
}


export async function loginController(req, res){
  
    try{
        const result = await loginUser(req.body);
        res.status(200).json({
            message: "user login successfully",
            user:result
        })
    }
    catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}