const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    AreaCode: {
      type: Integer,
      isRequired: true,
      isUnique: true,
    },
    Region: {
      type: Relationship,
      ref: "Region",
      many: true,
    },
    Vendors: {
      type: Relationship,
      ref: "Vendor.AreaCode",
      many: true,
    },
  },
  labelField: "AreaCode",
};
