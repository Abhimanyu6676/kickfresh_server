var GQL = require("./../../services/gql/userGql.js");
var updateUserMutation_withPass = GQL.updateUserMutation_withPass;
var updateUserMutation_withoutPass = GQL.updateUserMutation_withoutPass;

//::Helper Functions
const createNewTempUser = (req, res) => {
  let debug = true;
  var keystone = req.app.get("keystone");
  return new Promise(async (resolve, reject) => {
    try {
      await keystone
        .executeQuery("query{allUsers{username}}")
        .then(async (data) => {
          createNewUser({
            username: "tempUser" + data.data.allUsers.length,
            password: "tempPass1234",
            req: req,
          })
            .then((response) => {
              {
                debug &&
                  console.log(
                    "createTempUser Success 1" + JSON.stringify(response)
                  );
              }
              resolve(response);
            })
            .catch((err) => {
              {
                debug &&
                  console.log("createTempUser fail 1" + JSON.stringify(err));
              }
              reject(err);
            });
        })
        .catch((err) => {
          {
            debug &&
              console.log(
                "createTempUser Get All User Query fail 2" + JSON.stringify(err)
              );
          }
          reject(err);
        });
    } catch (error) {
      console.log("error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(error);
    }
  });
};

const createNewUser = (props) => {
  let debug = true;
  var keystone = props.req.app.get("keystone");
  return new Promise(async (resolve, reject) => {
    await keystone
      .executeQuery(
        "mutation ($name:String!,$pass:String!){createUser (data:{username:$name, password:$pass}){id username}}",
        {
          variables: {
            name: props.username,
            pass: props.password,
          },
        }
      )
      .then((data) => {
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
      .catch((err) => {
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

/**
 *
 * @param {props - req, withPass, id, _user, username, password, email, address}
 *      - props
 *      - - req<RequestObject>
 *      - - withPass<boolean> determine weather password to be updated or not
 *      - - id<UserObjectId> determine which user to be updated
 *      - - _user<UserObject> the User object being updated
 *
 * @requires req
 * @requires id
 *
 * @todo - TODO: remove the _user prop requirement, get it from the req object present in the props
 * @todo - TODO: add new update prop and put the feilds to be updated in update object
 */
const updateUser = (props) => {
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
            email: props.email
              ? props.email
              : props._user.email
              ? props._user.email
              : "",
            /* address: props.address
              ? props.address
              : props._user.Address
              ? props._user.Address
              : "", */
          },
        }
      )
      .then((data) => {
        if (data.errors) {
          {
            debug &&
              console.log("updateUser Error>> " + JSON.stringify(data.errors));
          }
          reject(data.errors);
          return;
        }
        {
          debug &&
            console.log("updateUser Resolution>> " + JSON.stringify(data));
        }
        resolve(data.data.updateUser);
      })
      .catch((err) => {
        {
          debug &&
            console.log("updateUser Rejection 1 :: Incorrect Query/Mutation");
        }
        reject("Query Cannot be made, Incorrect Request");
      });
  });
};

module.exports = { createNewTempUser, createNewUser, updateUser };
