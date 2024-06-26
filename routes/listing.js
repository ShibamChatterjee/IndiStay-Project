const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema}= require("../schema.js")
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer') //to parse uploaded image data
const {storage} = require('../cloudconfig.js')
const upload = multer({storage}) // fetch files and save in uploads folder


//Index Route
router.get("/", wrapAsync(listingController.index));
  
router.get("/homestay", isLoggedIn,listingController.filterHomestay)
router.get("/villas", isLoggedIn,listingController.filterVillas)
router.get("/amazingpools", isLoggedIn,listingController.filterAmazingpools)
router.get("/forest", isLoggedIn,listingController.filterForest)
router.get("/castles", isLoggedIn,listingController.filterCastles)
router.get("/mountain", isLoggedIn,listingController.filterMountain)
router.get("/lakefront", isLoggedIn,listingController.filterLakefront)
router.get("/islands", isLoggedIn,listingController.filterIslands)
router.get("/iconiccities", isLoggedIn,listingController.filterIconiccities)


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);




  //Show Route
  router.get("/:id", wrapAsync(listingController.showListing));
  
  //Create Route
  router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync( listingController.createListing));
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  
  //Update Route
  router.put("/:id",isLoggedIn, upload.single('listing[image]'),validateListing,isOwner,wrapAsync(listingController.updateListing));

  //Delete Route
  router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteLisitng));

 
  module.exports=router;

