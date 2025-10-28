
//using for practice

export const customErrors = {
    resourceDoesNotExist : {
        statusCode : 404,
        message : "Resource doesn't exist",
        code : "ResourceDoesntExist"
    },


     resourceAlreadyExist : {
        statusCode : 409,
        message : "Resource already exist",
        code : "ResourceAlreadyExist"
    },


    serverError : {
        statusCode : 500,
        message : "Server error",
        code :"ServerError"
    },


    validationError : {
        statusCode : 400,
        message : "Validation error",
        code : "ValidationError"
    },

    permissionDenied : {
        statusCode : 403,
        message : "Not authorized",
        code : "PermissionDenied"
    },

    authenticationFailed : {
        statusCode : 401,
        message : "Invalid token",
        code : "AuthenticationFailed"
    }, 

    databaseError : {
        statusCode : 400,
        message : "Invalid data in database",
        code : "DatabaseError"
    },

    conflictError : {
        statusCode : 400,
        message : "Conflict error",
        code : "ConflictError"
    },

    slotBookingExceeded : {
        statusCode : 409,
        message : "Slot booking trying to exceed total seats",
        code : "SlotBookingExceeded"
    }
}
