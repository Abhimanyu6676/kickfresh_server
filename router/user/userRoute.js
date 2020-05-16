//:: Imports
var express = require("express");
var router = express.Router();

var userMiddleware = require("./userMiddleware.js");
var userHelper = require("./userHelper.js");
var GQL = require("./../../services/gql/userGql.js");

var checkUser = userMiddleware.checkUser;
var getNewTempUser = userMiddleware.getNewTempUser;
var validateSignupRequest = userMiddleware.validateSignupRequest;
var createNewUser = userHelper.createNewUser;
var updateUser = userHelper.updateUser;
var SIGNIN = GQL.SIGNIN;

//:: check the curent user, if not present, create new temp user
router.get("/", checkUser, getNewTempUser, (req, res) => {
  if (req._user) {
    res.cookie("_user", req._user);
    console.log("sending>> " + JSON.stringify(req._user));
    res.send(req._user);
  } else {
    console.log("sending null>> " + JSON.stringify(req._user));
    res.status(404).send("No User Found");
  }
});

router.post("/signin", (req, res) => {
  console.log(
    "signinRequest" + req.body.body.username + "--" + req.body.body.pass
  );
  if (
    !req.body.body.username ||
    !req.body.body.pass ||
    req.body.body.pass.length < 8
  ) {
    res.send("Invalid Parameters");
    return;
  }
  var keystone = req.app.get("keystone");
  keystone
    .executeQuery(SIGNIN, {
      variables: {
        username: req.body.body.username,
        pass: req.body.body.pass,
      },
    })
    .then((res) => {
      console.log("res" + JSON.stringify(res));
      res.send(Success + "--" + res);
    })
    .catch((err) => {
      console.log("err" + JSON.stringify(err));
      res.status(401).send("failed");
    });
});

/**
 * @todo -->01 TODO: only update if the req._user is tempUser else send 422
 * @todo -->02 TODO: get the completee user object upon complete update and set as _user cookie
 */
router.post("/signup", validateSignupRequest, checkUser, async (req, res) => {
  if (req._user) {
    //-->01^
    console.log("Updating User>>> " + JSON.stringify(req._user));
    if (!req._user.id) {
      res.status(422).send("Invalid Parameters");
      return;
    }
    await updateUser({
      withPass: true,
      _user: req._user,
      req: req,
      id: req._user.id,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email ? req.body.email : null,
      phone: req.body.phone ? req.body.phone : null,
    })
      .then((response) => {
        console.log(response);
        //-->02>
        res.cookie("_user", response);
        res.send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(422).send(err);
      });
  } else {
    console.log("creating new User");
    //-->:create new user
    res.send("req._user");
  }
});

router.post("/createuser", (req, res) => {
  if (
    !req.body.body.username ||
    !req.body.body.password ||
    req.body.body.password.length < 8
  ) {
    console.log("fail 1");
    res.send("Invalid Parameters");
    return;
  }
  createNewUser({
    username: req.body.body.username,
    password: req.body.body.password,
    req: req,
  })
    .then((response) => {
      console.log("Success 1" + JSON.stringify(response));
      res.send(response);
    })
    .catch((err) => {
      console.log("fail 2" + JSON.stringify(err));
      res.status(401).send(err);
    });
});

//::Exports  AddUser($name:String)
module.exports = router;
