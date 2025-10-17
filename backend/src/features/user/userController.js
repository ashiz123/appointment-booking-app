import { userService } from "./userServices.js";
import { getLogger } from "../../shared/utils/logger.js";
import { responseHandler } from "../../shared/utils/responseHandler.js";

export async function registerController(req, res){
  try{
    const service = await userService();
    const user = await service.registerUser(req.body);
    if(user.success){
       res.status(200).json({
        message : "User registered succcessfully",
        user: user.newUser
     });
    }else{
      res.status(404).json('User cannot be registered');
    }
   
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
}


export async function loginController(req, res){
  
    try{
      const logger = getLogger();
      logger.info(req.body);
       const service = await userService();
       const result = await service.loginUser(req.body);
       responseHandler(res, result);
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}



export async function logoutController(){

}