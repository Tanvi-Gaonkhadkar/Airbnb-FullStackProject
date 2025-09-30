const express = require('express');
const app = express();
// const users= require("./routes/user.js");
// const posts= require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions ={
    secret: "mysupersecretstring",
     resave: false, 
     saveUninitialized: true,

};

// app.use(cookieParser("secretcode"));

// app.use("/users",users);
// app.use("/posts",posts);


// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.send("sent you some cookies!");
// })

// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     console.log(req.cookies);   // print in terminal
//     res.send(`Hi, ${name}`);
// });

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", { signed: true });
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.cookies);
//     res.send("verified");
// });



// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// });

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name=name;
    req.flash("success","user registered successfully");
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    
    res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
});


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;

//     }
    
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//     res.send("test successful!");
// });

const PORT = process.env.PORT || 3000;  // fallback to 3000 for local dev
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

