const bookingService=require("../services/booking-services")
async function createBooking(req,res){
    try {
        const flight=await bookingService.createBooking({
            flightId:req.body.flightId,
            userId:req.body.userId,
            noOfSeats:req.body.noOfSeats
        })
        return res.json(flight);
    } catch (error) {
        return res.json("error");
    }
}

async function makePayment(req,res){
    try {
        await bookingService.makePayment({
            bookingId:req.body.bookingId,
            userId:req.body.userId,
            totalCost:req.body.totalCost
        })
        return true;
    } catch (error) {
        return false;
    }
}

module.exports={
    createBooking,
    makePayment
}