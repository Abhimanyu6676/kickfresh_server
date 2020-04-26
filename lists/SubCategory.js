const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    SubCategory: {
      type: Text,
      isUnique: true,
      isRequired: true
    },
    SubSubCategory: {
      type: Relationship,
      ref: "SubSubCategory.SubCategory",
      many: true
    },
    Category: {
      type: Relationship,
      isRequired: true,
      ref: "Category.SubCategory"
    }
  },
  labelField: "SubCategory"
};
