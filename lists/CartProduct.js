const { Text, Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Product: {
      type: Relationship,
      ref: "Product",
      isRequired: true,
    },
    ProductName: {
      type: Text,
      /* isRequired: true, */
    },
    ProductID: {
      type: Text,
      /*   isRequired: true, */
    },
    Unit: {
      type: Text,
      /*  isRequired: true, */
    },
    orderQty: {
      type: Integer,
      /*  isRequired: true, */
    },
    orderPrice: {
      type: Integer,
      /*  isRequired: true, */
    },
    allotedVendor: {
      type: Relationship,
      ref: "Vendor.allotedProducts",
    },
  },
  labelField: "ProductName",
};
