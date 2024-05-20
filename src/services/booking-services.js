const {bookingrepository}=require("../repository");
const { AppError } = require("../utilities/Errors/AppError");
const db=require("../models");
const axios=require("axios");
const { StatusCodes } = require("http-status-codes");
const {bookingStatus}=require("../utilities/common/enum");
const {BOOKED,CANCELLED}=bookingStatus;
const {FlightService}=require("../config")
const bookingRepository=new bookingrepository();
async function createBooking(data){
    try {
        const transaction = await db.sequelize.transaction();
        const flight=await axios.get(`${FlightService}/${data.flightId}`);
        const flightdata=flight.data.data;
        console.log(data);
        if(flightdata.totalSeats>=data.noOfSeats){
            const totalCost=data.noOfSeats*flightdata.price;
            const bookingPayload={...data,totalCost};
            const booking=await bookingRepository.createBooking(bookingPayload,transaction);
            await axios.patch(`${FlightService}/${data.flightId}/seats`,{seats:data.noOfSeats,dec:1},transaction)
            await transaction.commit();
            console.log(booking);
            return booking;
        }
        else{
            await transaction.rollback();
            throw new AppError("The flight does not have sufficient seats",StatusCodes.BAD_REQUEST);
        }
    } catch (error) {
        await transaction.rollback();
        throw new AppError("Cannot find the flightId",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const booking=await bookingRepository.get(data.bookingId);
        const bookingDate=new Date(booking.createdAt);
        const currentDate=new Date();
        if(booking.status==CANCELLED){
            throw new AppError("Booking has expired",StatusCodes.BAD_REQUEST);
        }
        if(currentDate-bookingDate>300000){ 
            await bookingRepository.updateBooking(data.bookingId,{status:CANCELLED},transaction);
            await transaction.commit()          
            throw new AppError("Booking has expired",StatusCodes.BAD_REQUEST);
        }
        if(booking.totalCost!=data.totalCost){
            throw new AppError("Payment Unsuccesful due to amount not matching with the totalCost",StatusCodes.BAD_REQUEST);
        }
        if(booking.userId!=data.userId){
            throw new AppError("Payment Unsuccesful due to userId mismatch",StatusCodes.BAD_REQUEST);
        }
        await bookingRepository.updateBooking(data.bookingId,{status:BOOKED},transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw new AppError('Something went wrong while making payment',StatusCodes.INTERNAL_SERVER_ERROR);   
    }
}

async function cancelBooking(bookingId){
    const transaction = await db.sequelize.transaction();
    try {
        const booking=await bookingRepository.get(data.bookingId);
        if(booking.status==CANCELLED){
            await transaction.commit();
            return true;
        }
        await bookingRepository.updateBooking(data.bookingId,{status:CANCELLED},transaction);
        await axios.patch(`${FlightService}/${data.flightId}/seats`,{seats:booking.noOfSeats,dec:0},transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw new AppError('Something went wrong while cancelling the booking',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    createBooking,
    makePayment,
    cancelBooking
}