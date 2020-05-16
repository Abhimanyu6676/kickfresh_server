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

const updateUserMutation_withPass = `
mutation ($id:ID!,
  $username:String!,
  $password:String!,
  $FName:String!,
  $LName:String!,
  $email:String!) {
  updateUser(
    id: $id, 
    data: { username: $username,
      password:$password,
      FName:$FName, 
      LName:$LName, 
      email:$email }) {
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
  $email:String!) {
  updateUser(
    id: $id, 
    data: { 
      username: $username,
      FName:$FName, 
      LName:$LName, 
      email:$email }) {
    id
    username
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
    defaultAddress
  }
}
`;

module.exports = {
  SIGNIN,
  updateUserMutation_withPass,
  updateUserMutation_withoutPass,
  getUserFromDb,
};
