const express = require("express");
const jwt = require("jsonwebtoken");
xlsxj = require("xlsx-to-json");
Data = require("./constants/DummyProductList");
var cookieParser = require("cookie-parser");
var user = require("./router/user/userRoute");
var dataSet = require("./router/dataSet/dataSet.router");
const app = express();

const ACCESS_WEB_TOKEN =
  "a12b941c6e38e63915ed207b73e32b0cef620cbb8167c151b1c4407efa7207b1c0905d1d880e92b7813342675fe0965183ef3cc97554d72e56cab120e6c9ba79";

class Express {
  prepareMiddleware({ keystone, dev, distDir }) {
    app.set("keystone", keystone);
    app.use(express.json());
    app.use(cookieParser());
    app.use("/user", user);
    app.use("/add", dataSet);

    app.get(
      "/test",
      /* authenticateToken, */ (req, res) => {
        const user = { name: "user" };
        const ACCESS_TOKEN = jwt.sign(user, ACCESS_WEB_TOKEN, {
          expiresIn: "10m",
        });
        console.log("user: ", req.cookies);
        console.log(ACCESS_TOKEN);
        req.token = ACCESS_TOKEN;
        res.cookie("co", ACCESS_TOKEN).json({ Token: ACCESS_TOKEN });
      }
    );

    app.get("/addProducts", async (req, res) => {
      let Data1 = [];
      Data1 = Data.Products;
      Data1.map(async (item, index) => {
        if (index > 0 && item.ProductName) {
          await keystone
            .createItems({
              Product: [
                {
                  ProductName: item.ProductName,
                  ProductID: item.ProductID,
                  Category: item.Category,
                  SubCategory: item.SubCategory,
                  Unit: item.Unit,
                  Breakqty: item.Breakqty,
                  Price: item.Price,
                  isTrending: index % 20 ? 0 : 1,
                  Category: item.Category,
                  Category: item.Category,
                },
              ],
            })
            .then((res) => {
              console.log("*");
            })
            .catch((err) => {
              console.log("**" + err);
            });
        }
      });
      res.send("Products");
    });

    app.get("/addCategories", async (req, res) => {
      let Data1 = [];
      Data1 = Data.Products;
      let SubCategories = [],
        Categories = [];
      await keystone
        .executeQuery("query{allCategories{Category}}")
        .then((data) => {
          data.data.allCategories.map(async (item, index) => {
            Categories.push(item.Category);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      await keystone
        .executeQuery("query{allSubCategories{SubCategory}}")
        .then((data) => {
          data.data.allSubCategories.map(async (item, index) => {
            SubCategories.push(item.SubCategories);
          });
        })
        .catch((err) => {
          console.log(err);
        });

      Data1.map(async (item, index) => {
        if (index >= 0 && item.ProductName) {
          if (!Categories.includes(item.Category)) {
            await keystone
              .createItems({
                Category: [{ Category: item.Category }],
              })
              .then((res) => {
                Categories.push(item.Category);
              })
              .catch((err) => {
                console.log("error inserting category :: " + err);
              });
          }
          if (!SubCategories.includes(item.SubCategory)) {
            await keystone
              .createItems({
                SubCategory: [
                  {
                    SubCategory: item.SubCategory,
                    Category: { where: { Category: item.Category } },
                  },
                ],
              })
              .then((res) => {
                SubCategories.push(item.SubCategory);
              })
              .catch(async (err) => {
                console.log("error inserting subCategory :: " + err);
              });
          }
        }
      });
      res.send("Categories");
    });

    app.get("/json", (req, res) => {
      res.send("Hello");
      xlsxj(
        {
          input: "./constants/Products.xlsx",
          output: "./constants/output.json",
        },
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log(result);
            app.set("products", result);
          }
        }
      );
    });

    /* app.use(function(req, res, next) {
      console.log("==");
      console.log(req.headers.cookie);
      next();
    }); */

    return app;
  }
}

authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) res.sendStatus(401);
  console.log(token);
  jwt.verify(token, ACCESS_WEB_TOKEN, (err, user) => {
    if (err) return res.sendStatus(483);
    req.user = user;
    next();
  });
};

module.exports = { Express };
