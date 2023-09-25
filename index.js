const express=require("express")
const connection=require("./db")
const cors=require("cors")
const {userRouter}=require("./routes/userRoutes")
const {EmployeeRouter}=require("./routes/EmployeeRoutes")

require("dotenv").config()

const app=express()
app.use(cors())
app.use(express.json())


app.use("/users",userRouter)
app.use("/employees",EmployeeRouter)

app.listen(process.env.PORT,async()=>{
    try{
    await connection;
    console.log(`server is running on port  ${process.env.PORT}`)
    console.log("Connected to DB")
    }catch(err){
        console.log(err)
    }
});
