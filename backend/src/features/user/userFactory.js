

import bcrypt from 'bcrypt';
import { jwtService } from "../../shared/services/jwtServices.js";
import { redisClient } from '../../shared/config/redisClient.js';
import { AppError } from '../../shared/utils/appError.js';

export function userFactory(repository){

   return {
    //register
    async registerUser(userData){
            const existingUser = await repository.findUserByEmail(userData.email);
        
        if(existingUser){
            throw new Error('resourceAlreadyExist');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userToSave = {
            username : userData.username,
            email: userData.email,
            password: hashedPassword,
            created_at: new Date()
        }

         const data =  await repository.saveUser(userToSave);
         return {success: true, newUser: data};
    },

    //login
     async loginUser(userData){
            const user = await repository.findUserByEmail(userData.email);
            
            if(!user){
                throw new AppError('resourceDoesNotExist', [{path :"userFactory", msg: "User not found to login"}]);
            }

            const isMatch = await bcrypt.compare(userData.password, user.password);

            if(!isMatch){
                return {success: false, status: 401, message : "Wrong password"};
            }

            const payload = {
            userId : user._id,    //toString() in case need
            username: user.username,
            email: user.email
            //add token expires as well for production
            };

           
            const token =  jwtService.sign(payload)
            
            if(process.env.NODE_ENV != 'test'){
                  await redisClient.set(`session:${user._id}`, token, { EX: 60 * 60 * 24 } );
            }
          


            return {success : true, status : 200, message : "Login successful", data : {
                username : user.username,
                email : user.email,
                token : token
            }}
    },


    async getUserById(id){
        try{
             const cachedKey = `user:${id}`;
            const cachedUser = await redisClient.get(cachedKey);
          
            if(cachedUser){
                console.log("Already cached, User from cache");
                return JSON.parse(cachedUser);
            }

            const user = await repository.findUserById(id);
            await redisClient.set(cachedKey, JSON.stringify(user), {EX: 60*60});
            return {success : true, status: 200, data : user};
        }
        catch(err){
            console.log(err);
            throw new AppError('resourceDoesNotExist', [{path: 'userFactory', msg : 'user does no exist'}])
        }
    }


    

}



    

}