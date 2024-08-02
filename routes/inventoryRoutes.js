const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrgnaisationController, getOrgnaisationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require("../controllers/inventoryController");

const router = express.Router();

//routes
//Add Inventory || POST
router.post('/create-inventory',authMiddleware, createInventoryController);

//Get all blood records
router.get('/get-inventory', authMiddleware, getInventoryController);

//Get recent blood records
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);

//Get hospital blood records
router.post('/get-inventory-hospital', authMiddleware, getInventoryHospitalController);

//Get donar records
router.get('/get-donars', authMiddleware, getDonarsController);

//Get hospitals records
router.get('/get-hospitals', authMiddleware, getHospitalController);

//Get organisation records
router.get('/get-orgnaisation', authMiddleware, getOrgnaisationController);

//Get organisation records
router.get('/get-orgnaisation-for-hospital', authMiddleware, getOrgnaisationForHospitalController);

module.exports = router;