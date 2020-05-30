const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: {
      type: Text,
      isRequired: true,
    },
    vendorCode: {
      type: Integer,
      isUnique: true,
      isRequired: true,
    },
    AreaCode: {
      type: Relationship,
      ref: "Area.Vendors",
      many: true,
    },
    Products: {
      type: Relationship,
      ref: "Product.Vendors",
      many: true,
    },
    allotedProducts: {
      type: Relationship,
      ref: "cartProduct.allotedVendor",
      many: true,
    },
  },
  labelField: "VendorCode",
};
