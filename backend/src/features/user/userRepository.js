import {ObjectId} from 'mongodb';
import { AppError } from "../../shared/utils/appError.js";
import { redisClient } from '../../shared/config/redisClient.js';

export class UserRepository {

    constructor(db){
        this.db = db;
        this.collection = 'users';
    }

    async  findUserByUsername(username){
        try{
           return await this.db.collection(this.collection).findOne({username});   
        }catch(err){
            throw new Error('databaseError')
        } 
    }


    async  saveUser(user){
        try{
            const result = await this.db.collection(this.collection).insertOne(user);
            const userId = result.insertedId;
            return userId;
        }catch(err){
            throw new Error('databaseError')
        }
   
    }  

    async findUserByEmail(email){
        try{
            return await this.db.collection(this.collection).findOne({email});
        }catch(err){
            throw new Error('databaseError')
        }
    }

    async findUserById(id){
        try{
             const user = await this.db.collection(this.collection).findOne({_id : new ObjectId(id)});
             if(!user){
                 throw new AppError('resourceDoesNotExist',[{msg: "User not found"}] )
             }
             return user;
        }
        catch(err){
            throw new AppError("databaseError", [{msg: "Database error while getting user by id", detail: err.message}]);
        }
    }

 




    
}