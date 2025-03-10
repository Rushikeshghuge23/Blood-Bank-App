const userModel = require("../models/userModel");

//GET Donar List
const getDonarsListController = async (req, res) => {
    try{
        const donarData = await userModel
          .find({ role: "donar" })
          .sort({ createdAt: -1 });
        
        return res.status(200).send({
            success: true,
            Totalcount: donarData.length,
            message: "Donar List Fetched Successfully",
            donarData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donar List API',
            error
        });
    }
};

//GET Hospital List
const getHospitalListController = async (req, res) => {
    try{
        const hospitalData = await userModel
          .find({ role: "hospital" })
          .sort({ createdAt: -1 });
        
        return res.status(200).send({
            success: true,
            Totalcount: hospitalData.length,
            message: "Hospital List Fetched Successfully",
            hospitalData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Hospital List API',
            error
        });
    }
};

//GET ORG List
const getOrgListController = async (req, res) => {
    try{
        const orgData = await userModel
          .find({ role: "organisation" })
          .sort({ createdAt: -1 });
        
        return res.status(200).send({
            success: true,
            Totalcount: orgData.length,
            message: "ORG List Fetched Successfully",
            orgData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in ORG List API',
            error
        });
    }
};

//================================

//Delete Donar
const deleteDonarController = async (req,res) => {
    try{
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Record Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting",
            error
        });
    }
};



//Export
module.exports = {getDonarsListController, getHospitalListController, getOrgListController, deleteDonarController};