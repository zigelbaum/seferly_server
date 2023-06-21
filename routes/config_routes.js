const indexR = require("./index");
const usersR = require("./users");
const booksR = require("./books");
const subjectsR=require("./subjects");
const uploadsR=require("./uploads")


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/books",booksR);
  app.use("/subjects",subjectsR);
  app.use("/uploads",uploadsR);

  
}