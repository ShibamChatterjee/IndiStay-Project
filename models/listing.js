const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    } ,
    description:String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country:String,
    //adding review one listing can have many reviews so it is a one to many relation
    reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
     owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
     },
     geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      category:{
        type: String,
        enum: ["Iconic Cities","Islands","Lakefront","Mountain","Castles","Forest","Amazing pools","Villas","Home Stay"]
      }
});

//to delete the review when the post is deleted it a mongoose middleware
listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}})
}
})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports=Listing;
