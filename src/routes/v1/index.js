const express=require('express');
const { Model } = require('sequelize');
const bookingRoutes=require('./booking-routes.js')
const v1Routes=express.Router();

v1Routes.use('/bookings',bookingRoutes);


module.exports=v1Routes