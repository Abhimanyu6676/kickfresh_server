var express = require("express");
var router = express.Router();
Data = require("../../constants/DummyProductList");
const { Keystone } = require("@keystonejs/keystone");

//:: check the curent user, if not present, create new temp user
router.get("/category", async (req, res) => {
  let Data1 = [];
  Data1 = Data.Products;
  let SubCategories = [],
    Categories = [];
  var keystone = req.app.get("keystone");
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

router.get("/product", (req, res) => {
  let Data1 = [];
  Data1 = Data.Products;
  Data1.map(async (item, index) => {
    if (index > 0 && item.ProductName) {
      var keystone = req.app.get("keystone");
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
              Price: parseInt(item.Price),
              MRP: item.MRP ? parseInt(item.MRP) : 0,
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
  res.send(req.app.get("test"));
});

module.exports = router;
