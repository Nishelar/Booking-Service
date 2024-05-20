const { AppError } = require("../utilities/Errors/AppError");
const {StatusCodes}=require("http-status-codes")
class CrudRepository{
    constructor(model){
       this.model=model
    }

    async create(data){
        const response=await this.model.create(data);
        return response
    }

    async get(id){
        const response=await this.model.findByPk(id);
        if(!response){
           throw new AppError("The resouce ypu are looking for doesnot exists",StatusCodes.NOT_FOUND); 
        }
        return response;
    }

    async getAll(id){
        const response=await this.model.findAll();
        return response
    }

    async destroy(id){
        const response=await this.model.destroy({
            where:{
                id:id
            }
        })
        if(!response){
            throw new AppError("The resource you are lloking to delete doesnot exists",StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id,data){
        const response=await this.model.update(data,{
            where:{
                id:id
            }
        })
        if(response=="0"){
            throw new AppError("The resource you are looking for update doesnot exist",StatusCodes.NOT_FOUND)
        }
        return response;
    }
}

module.exports=CrudRepository