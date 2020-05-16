const { Text } = require("@keystonejs/fields");

module.exports = {
  fields: {
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
  },
  labelField: "email",
};
