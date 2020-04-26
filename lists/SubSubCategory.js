const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    SubSubCategory: {
      type: Text,
      isUnique: true,
      isRequired: true
    },
    SubCategory: {
      type: Relationship,
      isRequired: true,
      ref: "SubCategory.SubSubCategory"
    }
  },
  labelField: "SubSubCategory"
};
