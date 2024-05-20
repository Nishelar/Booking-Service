const CrudRepository = require("./crud-repository");
const {Booking}=require("../models")
const db=require("../models");
const axios = require("axios");
const {StatusCodes}=require("http-status-codes")
const { AppError } = require("../utilities/Errors/AppError");
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data,transaction){
         const response=await Booking.create(data,{transaction:transaction});
         return response;  
    }
    
    async updateBooking(id,data,transaction){
        const response=await this.model.update(data,{
            where:{
                id:id
            }
        },{transaction:transaction})
        if(response=="0"){
            throw new AppError("The resource you are looking for update doesnot exist",StatusCodes.NOT_FOUND)
        }
        return response;
    }
}

module.exports=BookingRepository