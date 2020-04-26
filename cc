# Write your query or mutation here
mutation signin($username: String, $password: String) {
  authenticate: authenticateUserWithPassword(username: $username, password: $password) {
    token
    item {
      email
    }
  }
}

{"username":"Shiva","password":"Ioplmkjnb"}