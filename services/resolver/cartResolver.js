const cartResolver = async (root, args, context, _, { query }) => {
  let debug = false;
  {
    debug && console.log("cartResolver args - " + JSON.stringify(args));
  }
  //:: query locations
  const {
    data: { allLocations },
  } = await query(
    `
  query($addID:ID!){
    allLocations(where:{address_some:{id:$addID}}){
      Location
      serviceActive
    }
  }`,
    { variables: { addID: args.addID } }
  );
  if (allLocations.length > 0 && allLocations[0].serviceActive) {
    {
      debug && console.log("location service active"),
        console.log(JSON.stringify(allLocations));
    }
    //::Query Result
    if (args.products.length > 0) {
      const {
        data: {
          multipleProduct: { Products },
        },
      } = await query(
        `
    query ($products:[multipleProductResolverInput!]!){
        multipleProduct (products:$products){
         Products{
            id
            ProductName
            ProductID
            Unit
            Breakqty
            Price
            MRP
         }
        }
    }
    `,
        { variables: { products: args.products } }
      );

      const resultObj = [];
      let success = true;
      let newCartObj = {}; ///new cart object for CartCreation
      newCartObj.status = "test";
      newCartObj.cartProducts = { create: [] };
      //::map over args Products
      await args.products.map((argsItem, argsIndex) => {
        let argProductFoundInResult = false;
        let tempitem = argsItem;
        {
          debug &&
            console.log(
              "checking for arg product " +
                argsItem.ProductName +
                " >> " +
                argsItem.ProductID
            );
        }
        //:::map over result product
        Products.map((resultItem, resultIndex) => {
          if (argProductFoundInResult) {
            {
              debug &&
                console.log(
                  "cart product " +
                    argsItem.ProductName +
                    " already found. Returning from Product loop index > " +
                    resultIndex
                );
            }
            return;
          }
          //::::section - Product found
          if (resultItem.ProductID == argsItem.ProductID) {
            argProductFoundInResult = true;
            {
              debug &&
                console.log(
                  "cart product " +
                    argsItem.ProductName +
                    " found at Product loop index > " +
                    resultIndex +
                    "where argsIndex is > " +
                    argsIndex
                );
            }
            //::resolve Prices
            if (argsItem.Price != resultItem.Price) {
              tempitem.Price = resultItem.Price;
              tempitem.modified = true;
              tempitem.PriceModified = true;
              success = false;
              {
                debug &&
                  (console.log(
                    "argsProduct" +
                      argsItem.ProductName +
                      "Price Mismatch with result Item. logging Modified Item >>>"
                  ),
                  console.log(tempitem));
              }
            }
            //::resolve order quantity available or not
            if (argsItem.orderQty > resultItem.Breakqty) {
              //tempitem.orderQtyExceeding = true;
              //tempitem.Breakqty = resultItem.Breakqty;
              //success = false;
            }
            resultObj.push(tempitem);
            return;
          }
          //::::section - product not found
          else if (
            resultIndex == Products.length - 1 &&
            !argProductFoundInResult
          ) {
            tempitem.available = false;
            success = false;
            {
              debug &&
                (console.log(
                  "argItem " +
                    argsItem.ProductName +
                    " not found in result products. logging updated Item for unavailablity >>>"
                ),
                console.log(tempitem));
            }
          }
        });
        //:::Product Resolved successfully
        if (success && argProductFoundInResult) {
          let tempitem2 = {};
          tempitem2.Product = { connect: { id: argsItem.id } };
          tempitem2.orderQty = argsItem.orderQty;
          newCartObj.cartProducts.create.push(tempitem2);
        }
      });
      //::cart Resolveed successfully
      if (success) {
        newCartObj.user = { connect: { id: args.userID } };
        newCartObj.deliveryAddress = { connect: { id: args.addID } };
        {
          true &&
            (console.log("cart Resolved successfully"),
            console.log(JSON.stringify(newCartObj)));
        }
        const data = await query(
          `
        mutation($data:CartCreateInput!){
          createCart(data:$data){
            id
          }
        }
        `,
          { variables: { data: newCartObj } }
        );
        {
          true &&
            (console.log("\n\ncart create response"),
            console.log(JSON.stringify(data)));
        }
      }
      //:: cart resolution failed
      else {
        {
          debug &&
            console.log(
              "cart resolution failed, sending updated results to client"
            ),
            console.log(resultObj);
        }
      }
      return {
        Products: resultObj,
        success: success ? "RESOLVED" : "NOT_RESOLVED",
        errorMsg: success ? "" : "MODIFIED",
      };
    } else {
      return { success: "NO_PRODUCT", errorMsg: "No Products in Cart" };
    }
  } else {
    console.log("location service not active");
    return { success: "NO_SERVICE", errorMsg: "SERVICE_UNAVAILABLE" };
  }
};

const cartResolverProduct =
  "type cartResolverProduct { id: ID, ProductName: String!, ProductID: String!,  Price: Int!, MRP: Int!, Breakqty: Int,  available: Boolean!, modified: Boolean!, PriceModified: Boolean!, orderQtyExceeding: Boolean!}";

const cartResolverOutput =
  "type cartResolverOutput {  Products:[cartResolverProduct], success: String!, errorMsg: String! }";

const cartResolverInput =
  "input cartResolverInput { id:ID!, ProductName: String!, ProductID: String!,orderQty:Int!, Price: Int!, MRP: Int!}";

module.exports = {
  cartResolver,
  cartResolverOutput,
  cartResolverInput,
  cartResolverProduct,
};

/* Products.map((_item) => {
        if (_item.ProductID == item.ProductID) {
          tempitem = _item;
          if (_item.Price == item.Price) {
            tempitem.modified = false;
          } else {
            tempitem.modified = true;
            success = false;
          }
          tempitem.available = true;
          return;
        }
      });
      console.log("______________________");
      console.log(tempitem);
      result.push(tempitem); */
