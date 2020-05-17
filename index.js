const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { StaticApp } = require("@keystonejs/app-static");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
//::Lists
const ProductSchema = require("./lists/Product.js");
const UserSchema = require("./lists/User.js");
const CartSchema = require("./lists/Cart.js");
const AreaSchema = require("./lists/Area.js");
const VendorSchema = require("./lists/Vendor.js");
const LandmarkSchema = require("./lists/Landmark.js");
const CategorySchema = require("./lists/Category.js");
const SubCategorySchema = require("./lists/SubCategory.js");
const SubSubCategorySchema = require("./lists/SubSubCategory.js");
const AddressSchema = require("./lists/Address.js");
const SubscribersListSchema = require("./lists/SubscribersList");
//::Custom Express App
const { Express } = require("./Express.js");

const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");

const PROJECT_NAME = "Kickfresh_Server";
const adapterConfig = {
  mongoUri: "mongodb://localhost:27017/kickfresh",
};

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  onConnect: async (keystone) => {
    let seed = false;
    {
      seed &&
        (await keystone.createItems({
          Landmark: [
            { Landmark: "PARAS" },
            { Landmark: "LOGIX" },
            { Landmark: "ATS" },
            { Landmark: "LOTUS" },
            { Landmark: "GAUR" },
          ],
          Area: [
            {
              AreaCode: 201501,
              Landmark: [
                { where: { Landmark: "PARAS" } },
                { where: { Landmark: "LOGIX" } },
              ],
            },
            {
              AreaCode: 201502,
              Landmark: [{ where: { Landmark: "ATS" } }],
            },
            {
              AreaCode: 201503,
              Landmark: [
                { where: { Landmark: "LOTUS" } },
                { where: { Landmark: "GAUR" } },
              ],
            },
          ],
          Vendor: [
            {
              Name: "Abhi",
              VendorCode: 001,
              AreaCode: [
                { where: { AreaCode: 201501 } },
                { where: { AreaCode: 201502 } },
              ],
            },
            {
              Name: "Shiva",
              VendorCode: 002,
              AreaCode: [{ where: { AreaCode: 201503 } }],
            },
          ],
        }));
    }
  },
});

keystone.createList("Category", CategorySchema);
keystone.createList("SubCategory", SubCategorySchema);
keystone.createList("SubSubCategory", SubSubCategorySchema);
keystone.createList("Landmark", LandmarkSchema);
keystone.createList("Area", AreaSchema);
keystone.createList("Product", ProductSchema);
keystone.createList("Vendor", VendorSchema);
keystone.createList("User", UserSchema);
keystone.createList("Cart", CartSchema);
keystone.createList("Address", AddressSchema);
keystone.createList("SubscribersList", SubscribersListSchema);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
  config: {
    identityField: "username", // default: 'email'
    secretField: "password", // default: 'password'
  },
});

module.exports = {
  keystone,
  apps: [
    new StaticApp({
      path: "/",
      src: "../kickfresh_app/web-build",
    }),
    new Express(),
    new GraphQLApp({
      apiPath: "/admin/api",
      graphiqlPath: "/admin/graphiql",
    }),
    new AdminUIApp({
      /* authStrategy, */
      enableDefaultRoute: true,
      /* isAccessAllowed: ({ authentication: { item: user, listKey: list } }) =>
        !!user && !!user.isAdmin */
    }),
  ],
};
