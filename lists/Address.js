const { Text, Integer, Checkbox, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    isDefault: {
      type: Checkbox,
      defaultValue: false,
    },
    addLine1: {
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
    /* city: {
      type: Text,
      isRequired: true,
    }, */
    city: {
      type: Relationship,
      ref: "Location.address",
      isRequired: true,
    },
    /*  region: {
      type: Relationship,
      ref: "Region",
    },  */
    region: {
      type: Text,
    },
    User: {
      type: Relationship,
      ref: "User.Address",
    },
  },
  labelField: "Address",
};
