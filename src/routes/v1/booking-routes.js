const express=require('express');
const bookingController=require("../../controller/booking-controller")
const bookingRoutes=express.Router();

bookingRoutes.post('/',bookingController.createBooking);

bookingRoutes.post(
    '/payments',
    bookingController.makePayment
);

module.exports=bookingRoutes 