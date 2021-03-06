const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { StaticApp } = require("@keystonejs/app-static");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
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
const SubscribersListSchema = require("./lists/SubscribersList.js");
const CartProductSchema = require("./lists/CartProduct.js");
const RegionSchema = require("./lists/Region.js");
const LocationSchema = require("./lists/Location.js");

//::Custom Imports
const { Express } = require("./Express.js");
const {
  cartResolver,
  cartResolverOutput,
  cartResolverInput,
  cartResolverProduct,
} = require("./services/resolver/cartResolver");
const {
  multipleProductResolver,
  multipleProductResolverOutput,
  multipleProductResolverInput,
} = require("./services/resolver/multipleProductResolver");

const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");

const PROJECT_NAME = "Kickfresh_Server";
const adapterConfig = {
  mongoUri: "mongodb://localhost:27017/kickfresh",
};

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  sessionStore: new MongoStore({
    url: "mongodb://localhost:27017/kickfresh_session",
  }),
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
keystone.createList("cartProduct", CartProductSchema);
keystone.createList("Region", RegionSchema);
keystone.createList("Location", LocationSchema);

keystone.extendGraphQLSchema({
  types: [
    {
      type: multipleProductResolverInput,
    },
    {
      type: multipleProductResolverOutput,
    },
    {
      type: cartResolverOutput,
    },
    {
      type: cartResolverInput,
    },
    {
      type: cartResolverProduct,
    },
  ],
  mutations: [],
  queries: [
    {
      schema:
        "multipleProduct(products:[multipleProductResolverInput!]!):multipleProductResolverOutput",
      resolver: multipleProductResolver,
    },
    {
      schema:
        "cartResolver(products:[cartResolverInput!]!, userID:ID!, addID:ID!): cartResolverOutput",
      resolver: cartResolver,
    },
  ],
});

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
  configureExpress: (app) => {
    app.set("trust proxy", true);
  },
  apps: [
    new Express(),
    new GraphQLApp({
      apiPath: "/backend/admin/api",
      graphiqlPath: "/backend/admin/graphiql",
    }),
    /*  new StaticApp({
       path: "/",
       src: "../kickfresh_app/web-build",
     }), */
    new AdminUIApp({
      adminPath: "/backend/admin",
      apiPath: "/backend/admin/api",
      graphiqlPath: "/backend/admin/graphiql",
      /* authStrategy, */
      enableDefaultRoute: true,
      /* isAccessAllowed: ({ authentication: { item: user, listKey: list } }) =>
        !!user && !!user.isAdmin */
    }),
  ],
};
