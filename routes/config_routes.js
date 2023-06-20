const indexR = require("./index");
const usersR = require("./users");
const booksR = require("./books");
const subjectsR=require("./subjects");
const citiesR = require("./cities")

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/books",booksR);
  app.use("/subjects",subjectsR);
  app.use("/cities",citiesR);
  
}