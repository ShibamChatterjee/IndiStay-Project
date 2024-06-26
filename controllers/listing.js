const { response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  }
  //filters
  module.exports.filterHomestay =  async (req, res) => {
    const allListings = await Listing.find({category:"Home Stay"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterVillas =  async (req, res) => {
    const allListings = await Listing.find({category:"Villas"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterAmazingpools =  async (req, res) => {
    const allListings = await Listing.find({category:"Amazing pools"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterForest =  async (req, res) => {
    const allListings = await Listing.find({category:"Forest"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterCastles =  async (req, res) => {
    const allListings = await Listing.find({category:"Castles"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterMountain =  async (req, res) => {
    const allListings = await Listing.find({category:"Mountain"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterLakefront =  async (req, res) => {
    const allListings = await Listing.find({category:"Lakefront"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterIslands=  async (req, res) => {
    const allListings = await Listing.find({category:"Islands"});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.filterIconiccities =  async (req, res) => {
    const allListings = await Listing.find({category:"Iconic Cities"});
    res.render("listings/index.ejs", { allListings });
  }

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
      }
    })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing does not exists!")
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

  module.exports.createListing = async (req, res,next) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id
    newListing.image = {url,filename}
    newListing.geometry = response.body.features[0].geometry
    await newListing.save();
    req.flash("success", "New listing created!")
    res.redirect("/listings");
}

module.exports.renderEditForm =async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing does not exists!")
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save()
  }
  req.flash("info", "Listing updated!")
  res.redirect(`/listings/${id}`);
}

module.exports.deleteLisitng= async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!")
  res.redirect("/listings");
}

