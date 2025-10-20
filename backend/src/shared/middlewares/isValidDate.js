export function isValidDate(req, res, next){
    const {date} = req.body;
    const dateEntered = new Date(date);
    dateEntered.setHours(0, 0, 0, 0);

    const currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);

    // const afterWeek = new Date(today);
    // afterWeek.setDate(today.getDate() + 7);

    if(dateEntered < currentTime ){
        return res.status(400).json({
            error : 'Date cannot be before than today'
        })
    }

   

    next();

}