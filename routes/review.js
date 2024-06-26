const express = require("express");
const router = express.Router({mergeParams:true});//mergeparams to access the id of listing
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema}= require("../schema.js")
const { isLoggedIn, isReviewAuthor, saveRedirectUrl } = require("../middleware.js");
const reviewController = require('../controllers/reviews.js')

//for server side validation of review
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
  }

//Review post Route
router.post("/",validateReview, isLoggedIn,wrapAsync(reviewController.createReview));
  
  
  //Delete review
  router.delete("/:reviewID", isLoggedIn,isReviewAuthor,
  wrapAsync(reviewController.deleteReview));
  
module.exports = router;