const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Name: {
      type: Text,
      isRequired: true
    },
    VendorCode: {
      type: Integer,
      isUnique: true,
      isRequired: true
    },
    AreaCode: {
      type: Relationship,
      ref: "Area.Vendors",
      many: true
    },
    Products: {
      type: Relationship,
      ref: "Product.Vendors",
      many: true
    }
  },
  labelField: "VendorCode"
};
