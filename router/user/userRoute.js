//:: Imports
var express = require("express");
var router = express.Router();

//::Middleware Functions
const checkUser = async (req, res, next) => {
  let debug = true;
  let _user = req.cookies._user || req.query._user || req.body._user;
  if (_user) {
    {
      debug && console.log("User :: " + _user);
    }
    var keystone = req.app.get("keystone");
    await keystone
      .executeQuery(getUserFromDb, {
        variables: {
          username: _user
        }
      })
      .then(data => {
        console.log("User from DB>> " + JSON.stringify(data.data.allUsers));
        if (data.data.allUsers.length) req._user = data.data.allUsers[0];
      })
      .catch(err => {
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
      .then(response => {
        {
          debug && console.log("tempUser>> " + JSON.stringify(response));
        }
        if (response.username) req._user = response;
        else req._user = null;
      })
      .catch(error => {
        {
          debug && console.log("tempUser>> " + JSON.stringify(error));
        }
        req._user = null;
      });
  }
  next();
};

//::Helper Functions
const createNewTempUser = (req, res) => {
  let debug = true;
  var keystone = req.app.get("keystone");
  return new Promise(async (resolve, reject) => {
    await keystone
      .executeQuery("query{allUsers{username}}")
      .then(async data => {
        createNewUser({
          username: "tempUser" + data.data.allUsers.length,
          password: "tempPass1234",
          req: req
        })
          .then(response => {
            {
              debug &&
                console.log(
                  "createTempUser Success 1" + JSON.stringify(response)
                );
            }
            resolve(response);
          })
          .catch(err => {
            {
              debug &&
                console.log("createTempUser fail 1" + JSON.stringify(err));
            }
            reject(err);
          });
      })
      .catch(err => {
        {
          debug &&
            console.log(
              "createTempUser Get All User Query fail 2" + JSON.stringify(err)
            );
        }
        reject(err);
      });
  });
};

const createNewUser = props => {
  let debug = true;
  var keystone = props.req.app.get("keystone");
  return new Promise(async (resolve, reject) => {
    await keystone
      .executeQuery(
        "mutation ($name:String!,$pass:String!){createUser (data:{username:$name, password:$pass}){username}}",
        {
          variables: {
            name: props.username,
            pass: props.password
          }
        }
      )
      .then(data => {
        if (data.data.createUser) {
          {
            debug &&
              console.log("createNewUser Resolution>> " + JSON.stringify(data));
          }
          resolve(data.data.createUser);
        } else if (data.errors) {
          {
            debug &&
              console.log("createNewUser rejection 1 :: reject with error");
          }
          reject(data);
        } else {
          {
            debug && console.log("createNewUser Rejection 2 :: unknown error");
          }
          reject("Unexpected Error");
        }
      })
      .catch(err => {
        {
          debug &&
            console.log(
              "createNewUser Rejection 3 :: Incorrect Query/Mutation"
            );
        }
        reject("Query Cannot be made, Incorrect Request");
      });
  });
};

const updateUser = props => {
  let debug = true;
  //-->:validate required variables are present(id, password & username in case of withPass)
  return new Promise(async (resolve, reject) => {
    var keystone = props.req.app.get("keystone"); //-->:check if withPass mutation is required or withoutPass
    await keystone
      .executeQuery(
        props.withPass
          ? updateUserMutation_withPass
          : updateUserMutation_withoutPass,
        {
          variables: {
            id: props.id,
            username: props.username
              ? props.username
              : props._user.username
              ? props._user.username
              : "",
            password: props.withPass && props.password ? props.password : "",
            FName: props.FName
              ? props.FName
              : props._user.FName
              ? props._user.FName
              : "",
            LName: props.LName
              ? props.LName
              : props._user.LName
              ? props._user.LName
              : "",
            Email: props.Email
              ? props.Email
              : props._user.email
              ? props._user.email
              : "",
            Address: props.Address
              ? props.Address
              : props._user.Address
              ? props._user.Address
              : ""
          }
        }
      )
      .then(data => {
        {
          debug &&
            console.log(
              "updateUser Resolution>> " + JSON.stringify(data.errors)
            );
        }
        if (data.errors) {
          reject(data.errors);
          return;
        }
        resolve(data);
      })
      .catch(err => {
        {
          debug &&
            console.log("updateUser Rejection 1 :: Incorrect Query/Mutation");
        }
        reject("Query Cannot be made, Incorrect Request");
      });
  });
};

//:: Routes
router.get("/", checkUser, getNewTempUser, (req, res) => {
  if (req._user) {
    res.cookie("_user", req._user);
    console.log("sending>> " + JSON.stringify(req._user));
    res.send(req._user);
  } else {
    console.log("sending null>> " + JSON.stringify(req._user));
    res.send("No User Found");
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
        pass: req.body.body.pass
      }
    })
    .then(res => {
      console.log("res" + JSON.stringify(res));
      res.send(Success + "--" + res);
    })
    .catch(err => {
      console.log("err" + JSON.stringify(err));
      res.status(401).send("failed");
    });
});

router.post("/signup", checkUser, async (req, res) => {
  if (
    !req.body.username ||
    !req.body.password ||
    req.body.password.length < 8
  ) {
    res.send("Invalid Parameters");
    return;
  }
  if (req._user) {
    console.log("Updating User>>> " + JSON.stringify(req._user));
    if (!req._user.id) {
      res.status(404).send("Invalid Parameters");
      return;
    }
    await updateUser({
      withPass: true,
      _user: req._user,
      req: req,
      id: req._user.id,
      username: req.body.username,
      password: req.body.password
    })
      .then(response => {
        console.log(response);
        res.send(response);
      })
      .catch(err => {
        console.log(err);
        res.status(404).send(err);
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
    req: req
  })
    .then(response => {
      console.log("Success 1" + JSON.stringify(response));
      res.send(response);
    })
    .catch(err => {
      console.log("fail 2" + JSON.stringify(err));
      res.status(401).send(err);
    });
});

//::Exports  AddUser($name:String)
module.exports = router;

const SIGNIN = `
  mutation signin($username: String, $pass: String) {
    authenticate: authenticateUserWithPassword(username:$username, password:$pass) {
      token
      item {
        id
        username
        isAdmin
      }
    }
  }
`;

const getUserFromDb = `
query ($username:String!){
  allUsers(where:{username:$username}){
    id
    username
    FName
    LName
    email
    Address
  }
}
`;

const updateUserMutation_withPass = `
mutation ($id:ID!,
  $username:String!,
  $password:String!,
  $FName:String!,
  $LName:String!,
  $Email:String!, 
  $Address:String!) {
  updateUser(
    id: $id, 
    data: { username: $username,
      password:$password,
      FName:$FName, 
      LName:$LName, 
      email:$Email, 
      Address:$Address }) {
    id
    username
  }
}
`;

const updateUserMutation_withoutPass = `
mutation ($id:ID!,
  $username:String!,
  $FName:String!,
  $LName:String!,
  $Email:String!, 
  $Address:String!) {
  updateUser(
    id: $id, 
    data: { 
      username: $username,
      FName:$FName, 
      LName:$LName, 
      email:$Email, 
      Address:$Address }) {
    id
    username
  }
}
`;
