const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn, isOwner}= require("../middleware.js");
const multer= require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400); // message first, then status
  } else {
    next();
  }
};



//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

router.route("/")
.get( wrapAsync(listingController.index))
.post(
  isLoggedIn,
  
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner, 
   upload.single("listing[image]"),
   validateListing,
  wrapAsync(listingController.updateListing))
.delete(
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.destroyListing)
  );

router.get("/", (req, res) => {
    res.render("listings/index", { listings }); 
});

module.exports = router;