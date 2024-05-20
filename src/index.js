const express=require("express")
const ApiRouter=require("./routes")
const {PORT}=require("./config")

const app=express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use('/api',ApiRouter)

app.listen(PORT,()=>{
   
   console.log(`Server is running on PORT: ${PORT}`)
})