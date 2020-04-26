const { Text, Password, Checkbox, Select } = require("@keystonejs/fields");

module.exports = {
  /* access: {
    // 1. Only admins can read deactivated user accounts
    read: ({ authentication: { item } }) => {
      if (item.isAdmin) {
        return {}; // Don't filter any items for admins
      }
      // Approximately; users.filter(user => user.state !== 'deactivated');
      return {
        state_not: "deactivated"
      };
    }
    // auth: true
  }, */
  fields: {
    username: {
      type: Text,
      isUnique: true,
      isRequired: true
    },
    email: {
      type: Text
      // 2. Only authenticated users can read/update their own email, not any other user's.
      // Admins can read/update anyone's email.
      /* access: ({ existingItem, authentication: { item } }) => {
        return item.isAdmin || existingItem.id === item.id;
      } */
    },
    password: {
      type: Password,
      isRequired: true
      /* access: {
        // 3. Only admins can see if a password is set. No-one can read their own or other user's passwords.
        read: ({ authentication }) => authentication.item.isAdmin,
        // 4. Only authenticated users can update their own password. Admins can update anyone's password.
        update: ({ existingItem, authentication: { item } }) => {
          return item.isAdmin || existingItem.id === item.id;
        }
      } */
    },
    isAdmin: { type: Checkbox, defaultValue: false },
    state: {
      type: Select,
      options: ["active", "deactivated"],
      defaultValue: "active"
    }
  },
  labelField: "username"
};
