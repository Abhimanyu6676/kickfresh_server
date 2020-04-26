const { Text } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Landmark: {
      type: Text,
      isUnique: true,
      isRequired: true
    }
  },
  labelField: "Landmark"
};
