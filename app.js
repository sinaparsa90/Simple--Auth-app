let express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    User                  = require ("./models/user"),
    passportLocalMongoose = require("passport-local-mongoose");

   let app = express();
   
mongoose.connect("mongodb://localhost/auth_demo_app");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs" );

app.use(require("express-session")({
    secret:"Rusty is the best and cutest dog in the world",
    resave: false,
    saveUnitialized: false
 }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =========
// ROUTES
// =========

app.get("/", function(req, res){
    res.render("home")
})

app.get("/secret",isLoggedIn, function(req, res){
    res.render("secret")
})

// Auth ROUTES
// SHow sign up form

app.get("/register", function(req, res){
    res.render("register");
} )

// handling user sign up

app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
           passport.authenticate("local") (req, res, function(){
               res.redirect("/secret");
           })
        }
    })
})

// LOGIN ROUTES
// RENDER LOGIN FORM
app.get("/login", function(req, res){
    res.render("login")
});

// login logic
// middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect:"/login"
}) , function(req, res){

})

// Logout ROUTES
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen ("3000", function(){
    console.log("AuthDemo is started")
})