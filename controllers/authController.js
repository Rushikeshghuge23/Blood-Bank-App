const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const registerController = async (req,res) => {
    try {
        const exisitingUser = await userModel.findOne({email: req.body.email});
        //validation
        if(exisitingUser){
            return res.status(200).send({
                success: false,
                message: 'User already exists'
            });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashedPassword;
        //rest data
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success:true,
            message:'user Registerd Successfully',
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in register API',
            error: error.message,
        });
    }
};

//login call back
const loginController = async (req,res) => {
    try{
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Invalid Credintials"
            })
        }
        //check role
        if(user.role !== req.body.role){
            return res.status(500).send({
                success:false,
                message:"role dosent match",
            });
        }
        //compare password
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if(!comparePassword){
            return res.status(500).send({
                success:false,
                message:"Invalid Credintials"
            })
        }
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'})
        return res.status(200).send({
            success:true,
            message:"Login Successfully",
            token,
            user,
        })
    }catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Error in Login Api',
            error,
        });
    }

};

//get current user
const currentUserController = async (req,res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId});
        return res.status(200).send({
            success:true,
            message:"user fetched successfully",
            user,
        });
    }catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message: 'unable to get current user',
            error
        })
    }
};

module.exports = {registerController, loginController, currentUserController};