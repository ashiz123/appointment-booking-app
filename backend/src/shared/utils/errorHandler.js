export function handleError(res, err, status=500, message="Internal Server Error"){
    console.log(message, err);
    return res.status(status).json({
        success: false,
        message,
        error: err.message
    })
}