const { Text, Integer, Checkbox, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    isDefault: {
      type: Checkbox,
      defaultValue: false,
    },
    addLine1: {
      //house number and street
      type: Text,
      isRequired: true,
    },
    addLine2: {
      type: Text,
      isRequired: true,
    },
    addRef: {
      type: Text,
      isRequired: true,
    },
    city: {
      type: Text,
      isRequired: true,
    },
    state: {
      type: Text,
      isRequired: true,
    },
    Pincode: {
      type: Integer,
    },
    User: {
      type: Relationship,
      ref: "User.Address",
    },
  },
  labelField: "Address",
};
