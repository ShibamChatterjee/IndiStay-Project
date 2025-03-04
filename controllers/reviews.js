const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview=async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id
    console.log(newReview );
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
  }

  module.exports.deleteReview= async(req,res)=>{
  
    let {id , reviewID} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}})
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/listings/${id}`); 
  }