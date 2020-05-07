const { Text, Relationship, Select } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Status: {
      type: Select,
      options: "active, ordered, delivered",
      isRequired: true
    },
    Products: {
      type: Relationship,
      ref: "Product",
      many: true
    },
    User: {
      type: Relationship,
      isRequired: true,
      ref: "User.Cart"
    },
    DeliveryAddress: {
      type: Text,
      isRequired: true
    }
  }
};
