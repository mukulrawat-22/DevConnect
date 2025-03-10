const adminAuth = (req,res,next) => {
    //logic for checking if the request is authorized
    console.log("admin auth is getting checked")
    const token = "xyddz";
    const isAdminAthorized = token === "xyz";
    if (!isAdminAthorized) {
      res.status(401).send("Unauthorized Access!");
    } else {
      next();
    }
  };

  const userAuth = (req,res,next) => {
    //logic for checking if the request is authorized
    console.log("admin auth is getting checked")
    const token = "xyddz";
    const isAdminAthorized = token === "xyz";
    if (!isAdminAthorized) {
      res.status(401).send("Unauthorized Access!");
    } else {
      next();
    }
  };


  module.exports = {
    adminAuth, userAuth
  };