var GQL = require("./../../services/gql/userGql.js");
var getUserFromDb = GQL.getUserFromDb;
var userHelper = require("./userHelper.js");
var createNewTempUser = userHelper.createNewTempUser;
var assert = require("assert");

//::Middleware Functions
const checkUser = async (req, res, next) => {
  let debug = true;

  let _user;
  try {
    var query__userObj = JSON.parse(
      req.query.__userObj ? req.query.__userObj : "{}"
    );
    var body__userObj = JSON.parse(
      req.body.__userObj ? req.body.__userObj : "{}"
    );
    if (query__userObj.username) {
      _user = query__userObj;
      console.log("query param");
      console.log(query__userObj);
    } else if (body__userObj.username) {
      _user = body__userObj;
      console.log("body object");
      console.log(body__userObj);
    } else {
      //_user = req.cookies._user;
      console.log("cookie object");
      console.log(req.cookies._user);
    }
  } catch (error) {}

  if (_user) {
    {
      debug && console.log("User :: ");
      debug && console.log(_user);
    }
    var keystone = req.app.get("keystone");
    await keystone
      .executeQuery(getUserFromDb, {
        variables: {
          username: _user.username,
        },
      })
      .then((data) => {
        console.log("User from DB>> " + JSON.stringify(data.data.allUsers));
        if (data.data.allUsers.length) req._user = data.data.allUsers[0];
      })
      .catch((err) => {
        console.log("User from DB Error>> " + JSON.stringify(err));
      });
  }
  next();
};

const getNewTempUser = async (req, res, next) => {
  let debug = true;
  if (!req._user) {
    {
      debug && console.log("No User Found, getting temp user");
    }
    await createNewTempUser(req, res)
      .then((response) => {
        {
          debug && console.log("tempUser>> " + JSON.stringify(response));
        }
        if (response.username) req._user = response;
        else req._user = null;
      })
      .catch((error) => {
        {
          debug && console.log("tempUser>> " + JSON.stringify(error));
        }
        req._user = null;
      });
  }
  next();
};

const validateSignupRequest = (req, res, next) => {
  if (
    !req.body.username ||
    !req.body.password ||
    req.body.password.length < 8
  ) {
    res.status(422).send("Invalid Parameters");
    return;
  }
  console.log("validated");
  next();
};

module.exports = {
  checkUser,
  getNewTempUser,
  validateSignupRequest,
};
