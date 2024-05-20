const dotenv=require('dotenv');

dotenv.config()

module.exports={
    serverConfig:process.env.PORT,
    FlightService:process.env.FLIGHT_SERVICE,
}