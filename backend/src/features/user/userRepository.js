

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



    
}