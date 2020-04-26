const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Category: {
      type: Text,
      isUnique: true,
      isRequired: true
    },
    SubCategory: {
      type: Relationship,
      ref: "SubCategory.Category",
      many: true
    }
  },
  labelField: "Category"
};
