const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    ProductName: {
      type: Text,
      isRequired: true,
    },
    ProductID: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
    Category: {
      type: Text,
      //ref: "Category",
      isRequired: true,
    },
    SubCategory: {
      type: Text,
      //ref: "SubCategory",
      isRequired: true,
    },
    SubSubCategory: {
      type: Text,
    },
    Unit: {
      type: Text,
      isRequired: true,
    },
    Breakqty: {
      type: Text,
      isRequired: true,
    },
    Price: {
      type: Integer,
      isRequired: true,
    },
    MRP: {
      type: Integer,
      isRequired: true,
    },
    isTrending: {
      type: Integer,
      isRequired: true,
    },
    Vendors: {
      type: Relationship,
      ref: "Vendor.Products",
      many: true,
    },
  },
  labelField: "ProductName",
};
