const mongoose=require('mongoose');

const prescriptionSchema=new mongoose.Schema({
    doctor:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    patient:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    medicines:[{name:String,dosage:String,instrcutions:String}],
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Prescription",presriptionSchema);
