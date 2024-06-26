const Listing = require("./models/listing")
const Review = require("./models/review");
const {listingSchema} = require("./schema")
const ExpressError = require("./utils/ExpressError")

//For server side validation
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
  }

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("info","Make sure you are logged in")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}= req.params
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You cant have the access of this listing")
      return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewID}= req.params
    let review = await Review.findById(reviewID)
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "Your are not author of this review")
      return res.redirect(`/listings/${id}`);
    }
    next()
}