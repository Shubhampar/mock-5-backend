const mongoose= require("mongoose")

const EmployeeSchema=mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    department:String,
    salary:String,
})

const EmployeeModel=mongoose.model("employee",EmployeeSchema)

module.exports=EmployeeModel