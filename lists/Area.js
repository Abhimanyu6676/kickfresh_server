const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    AreaCode: {
      type: Integer,
      isRequired: true,
      isUnique: true
    },
    Landmark: {
      type: Relationship,
      ref: "Landmark",
      many: true
    },
    Vendors: {
      type: Relationship,
      ref: "Vendor.AreaCode",
      many: true
    }
  },
  labelField: "AreaCode"
};
