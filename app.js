if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const { listingSchema } = require("./schema.js");
const review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// const MONGO_url = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl =
  "mongodb+srv://oyeankit6:K2dk7uM33v5CFWcz@cluster0.jhrxdjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const flash = require("connect-flash");

const sessionOptions = {
  secret: "MySupuercode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    express: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;

  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

// app.get("/testlisting", async (req,res)=>{
//   let sampleListing=new Listing({
//     title:"My New Villa",
//   description: "By The beach",
//   price : 1200,
//   location :"Calangute,Goa",
//   country:"India",
// });

// await sampleListing.save();
// console.log ("sample was saved");
// res.send("successful testing")

// })

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });

  let registerdUser = await User.register(fakeUser, "helloworld");
  res.send(registerdUser);
});

// app.get("/", (req, res) => {
//   res.send("hi , i m root");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found ! "));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somthing Went Wrong" } = err;
  //res.send("Somthing Went Wrong");
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is listening at post 8080");
});
