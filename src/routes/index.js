const express=require("express");
const v1Routes = require("./v1");

const ApiRouter=express.Router()

ApiRouter.use('/v1',v1Routes);

module.exports=ApiRouter