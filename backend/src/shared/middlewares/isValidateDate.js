export function isValidateDate(req, res, next){
    const {date} = req.body;
    const dateEntered = new Date(date);
    dateEntered.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const afterWeek = new Date(today);
    // afterWeek.setDate(today.getDate() + 7);

    if(dateEntered < today ){
        return res.status(400).json({
            error : 'Date cannot be before than today'
        })
    }

   

    next();

}