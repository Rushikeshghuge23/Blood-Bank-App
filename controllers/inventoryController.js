const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//create inventory
const createInventoryController = async (req,res) => {
    try{
        const {email} = req.body;
        //validation
        const user = await userModel.findOne({email});
        if(!user){
            throw new Error('user not found');
        }
        // if(inventoryType === 'in' && user.role !== 'donar'){
        //     throw new Error('Not a donar account')
        // }
        // if(inventoryType === 'out' && user.role !== 'hospital'){
        //     throw new Error('Not a hospital');
        // }

        if(req.body.inventoryType == 'out'){
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            //calculate blood quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType:'in',
                    bloodGroup: requestedBloodGroup
                }},{
                    $group:{
                        _id: '$bloodGroup',
                        total:{$sum : '$quantity'}
                    }
                }
            ])
            //console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            //calculate out blood quantity
            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType:'out',
                    bloodGroup: requestedBloodGroup
                }},
                {
                    $group:{
                        _id: '$bloodGroup',
                        total: {$sum : '$quantity'}
                    }
                }
            ])
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & out calculation
            const availableQuantityOfBloodGroup = totalIn - totalOut;

            //quantity validation
            if(availableQuantityOfBloodGroup < requestedQuantityOfBlood){
                return res.status(500).send({
                    success:false,
                    message: `only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }


        //saved record
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success:true,
            message:'New Blood Record Added'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in create inventory API',
            error
        })
    }
};


//Get all blood records
const getInventoryController = async (req,res) => {
    try{
        const inventory = await inventoryModel.find({
            organisation: req.body.userId,
        }).populate("donar").populate("hospital").sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get all records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get all inventory",
            error,
        });
    }
};

//Get hospital blood records
const getInventoryHospitalController = async (req,res) => {
    try{
        const inventory = await inventoryModel
          .find(req.body.filters)
          .populate("donar")
          .populate("hospital")
          .populate("organisation")
          .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get hospital consumer records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get consumer inventory",
            error,
        });
    }
};

//Get blood record of 3
const getRecentInventoryController = async (req, res) => {
    try{
        const inventory = await inventoryModel
        .find({
            organisation: req.body.userId,
        })
        .limit(3)
        .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "resent Inventory Data",
            inventory,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Recent Inventory API',
            error
        }); 
    }
};


//Get Donar Record
const getDonarsController = async (req,res) => {
    try{
        const organisation = req.body.userId;
        //find donars
        const donarId = await inventoryModel.distinct("donar", {
            organisation,
        });
        //console.log(donarId);
        const donars = await userModel.find({_id: { $in: donarId } });

        return res.status(200).send({
            success: true,
            message: "Donar Record Fetched SuccessFully",
            donars,
        });
    } catch (error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donar records',
            error
        })
    }
};

const getHospitalController = async (req,res) => {
    try{
        const organisation = req.body.userId;
        //Get Hospital ID
        const hospitalId = await inventoryModel.distinct("hospital", {
            organisation,
        });
        //find Hospital
        const hospitals = await userModel.find({
            _id: {$in: hospitalId },
        });
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Fetched Successfully",
            hospitals,
        });
    } catch (error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In get Hospitals API",
            error
        })
    }
};

//Get ORG Profiles
const getOrgnaisationController = async (req,res) => {
    try{
        const donar = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation",{donar});
        //find org
        const organisations = await userModel.find({
            _id: {$in:orgId}
        });
        return res.status(200).send({
            success:true,
            message:"Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Error in ORG API",
            error
        });
    }
};

//Get ORG for hospital
const getOrgnaisationForHospitalController = async (req,res) => {
    try{
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation",{hospital});
        //find org
        const organisations = await userModel.find({
            _id: {$in:orgId}
        });
        return res.status(200).send({
            success:true,
            message:"Hospital Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Error in Hospital ORG API",
            error
        });
    }
};

module.exports = {
    createInventoryController,
    getInventoryController, 
    getDonarsController,
    getHospitalController,
    getOrgnaisationController,
    getOrgnaisationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController,
};