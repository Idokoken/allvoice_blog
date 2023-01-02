const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayout = require("express-ejs-layouts");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const postRouter = require("./routes/postRouter");
const indexRouter = require("./routes/indexRouter");

require("dotenv").config();

const app = express();
const port = process.env.PORT;
app.use(expressLayout);

//views setup
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "layouts/layout");

//database setup
// "mongodb://localhost/allvoice"
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", () => console.log(`error connecting to database`));
db.once("open", () =>
  console.log(`connected to ${chalk.cyan("AllVoice database")}`)
);

//middleware setup
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);
//app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
global.moment = require("moment");

//route setup
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/post", postRouter);

app.listen(port, () => console.log("listening on port " + chalk.cyan(4000)));
