const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Region: {
      type: Text,
      isRequired: true,
    },
    Location: {
      type: Relationship,
      ref: "Location.Region",
    },
    Pincode: {
      type: Integer,
    },
    Landmark: {
      type: Relationship,
      ref: "Landmark",
      many: true,
    },
  },
  labelField: "Region",
};
