

import bcrypt from 'bcrypt';
import { jwtService } from "../../shared/services/jwtServices.js";



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
                throw new Error('validationError');
            }

            const isMatch = await bcrypt.compare(userData.password, user.password);

            if(!isMatch){
                return {success: false, status: 401, message : "Wrong password"};
            }

            const payload = {
            userId : user._id,    //toString() in case need
            username: user.username,
            email: user.email
            };

            const token =  jwtService.sign(payload)

            return {success : true, status : 200, message : "Login successful", data : {
                username : user.username,
                email : user.email,
                token : token
            }}
    },


    

}



    

}