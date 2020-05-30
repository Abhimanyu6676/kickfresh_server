//:: Imports
var express = require("express");
var router = express.Router();

const gql_resolveCart = `
  query($products: [cartResolverInput!]!) {
    cartResolver(products: $products) {
      Products {
        ProductName
        ProductID
        Category
        SubCategory
        Price
        MRP
        Breakqty
        isTrending
        Unit
        modified
      }
      success
    }
  }
`;

router.post("/cartResolver", (req, res) => {
  console.log("cartResolver");
  console.log(req.body.products);
  if (!req.body.products || req.body.products.length == 0) {
    console.log("No products in parameters");
    res.send("Invalid Parameters");
    return;
  }
  var keystone = req.app.get("keystone");
  keystone
    .executeQuery(gql_resolveCart, {
      variables: {
        products: req.body.products,
      },
    })
    .then((response) => {
      console.log("res" + JSON.stringify(response));
      res.send(response);
    })
    .catch((err) => {
      console.log("err " + JSON.stringify(err));
      res.status(401).send("failed");
    });
});

//::Exports  AddUser($name:String)
module.exports = router;
