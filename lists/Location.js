const { Text, Integer, Relationship, Checkbox } = require("@keystonejs/fields");

module.exports = {
  fields: {
    Location: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    State: {
      type: Text,
      isRequired: true,
    },
    Region: {
      type: Relationship,
      ref: "Region.Location",
      many: true,
    },
    address: {
      type: Relationship,
      ref: "Address.city",
      many: true,
    },
    serviceActive: {
      type: Checkbox,
      defaultValue: false,
      isRequired: true,
    },
  },
  labelField: "Location",
};
