export default function errorHandler(err, req, res , next){
  
    const status = err.status || 500;
    const message = 
     process.env.NODE_ENV === 'production' 
     ? 'Something went wrong'
     : err.message 

    res.status(status).json({
        success: false,
        error: message,
        })
}

