export  function isValidateDate(day, next){
    const dateEntered = new Date(day);
    dateEntered.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    if(dateEntered < today){
        throw new Error('Date cannot be before today');
    } 

    next();
}