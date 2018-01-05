var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");
//Index - show all campgrounds
router.get("/", function(req,res){
    //get all campgrounds from db
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
//create
router.post("/", middleware.isLoggedIn, function(req,res){
   // get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var price = req.body.price;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name, image: image, price: price, description: description, author: author};
   //create new campground and save to db
   Campground.create(newCampground, function(err,newlyCreated){
       if(err){
           console.log(err);
       } else {
             //redirect back to campgrounds page
   res.redirect("/campgrounds");
       }
   });
});

router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//Show- more info about campground

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found.");
            console.log(err);
            res.redirect("back");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});  
    });
});

//update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct camp
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground deleted.")
           res.redirect("/campgrounds");
       }
   });
});


module.exports = router;