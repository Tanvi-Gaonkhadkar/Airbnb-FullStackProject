// Authentication Account:
// username: Tanvi ,
// email:tanvig@gmail.com,
// password:tanvi


require('dotenv').config();
console.log("SECRET:", process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport=require("passport");
const localStrategy= require("passport-local");
const User=require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user || null;  
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;

  next();
});

app.get("/demouser",async(req,res)=>{
  let fakeUser= new User({
    email:"student@gmail.com",
    username:"delta-student"
  });
  let registeredUser = await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})

const userRouter= require("./routes/user.js");
const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js")


// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.use("/",userRouter);
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)

app.get("/test-login", (req, res) => {
    res.render("users/login");  // should render without error
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});


// app.all("*",(req,res,next)=>{
//   next (new ExpressError(404,"Page Not Found!"));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("listings/error", { err });
});

const PORT = process.env.PORT || 8080;   // use Render's port
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server is running on port ${PORT}`);
});

