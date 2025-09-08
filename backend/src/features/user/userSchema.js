import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";


export async function runCreateUserSchema(db){
   const userSchema = {
     $jsonSchema : {
        bsonType : Object,
        title : 'User schema',
        required : ['username', 'email', 'password', 'created_at'],
        properties : {
            username : {bsonType : "string", description : "Username must be string"},
            email : {bsonType : "string", pattern: "^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$", description: "Email field is required" },
            password : {bsonType : "string", minLength: 8, description: "Password must be at least 8 character long"},
            created_at : {bsonType : "date",  description: "Created at date of document"}, 
        }
    }
   }

   const options = {
    validator : userSchema,
    validationLevel : "strict",
    validationAction : "error",
   }

   const collectionName = "users";
   await createUpdateSchema(db, collectionName, options);
}