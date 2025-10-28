

export class AppError extends Error
{
   constructor(message, error = []){
   
        super(message); //calling parent constructor
        this.error = error;
        
    }
}