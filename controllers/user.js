const User= require("../models/user");


module.exports.SignUp=async (req, res) => {
    try{
         const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
  req.login(registeredUser, (err) => {
    if (err) {
        return next(err);
    }
    // if login succeeds
    req.flash("success", "Welcome to our site!");
    res.redirect("/listings");
});

    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
}
};

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
};

module.exports.renderLoginForm=(req,res) => {
    res.render("users/login");
};

module.exports.login= async(req,res)=>{
        req.flash("success","Welcome back to wonderlust");
        res.redirect("/listings");
    };

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};    