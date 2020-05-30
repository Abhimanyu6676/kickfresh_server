const multipleProductResolver = async (root, args, context, _, { query }) => {
  //console.log("multipleProductResolver args - " + JSON.stringify(args));
  if (args.products.length > 0) {
    const {
      data: { allProducts },
    } = await query(`
  query{
    allProducts{
      ProductName
      ProductID
      Category
      SubCategory
      Price
      MRP
      Breakqty
      isTrending
      Unit
    }
  }
`);
    const result = [];
    await allProducts.map((item, index) => {
      args.products.map((product, index) => {
        if (product.ProductID == item.ProductID) {
          result.push(item);
          return;
        }
      });
    });

    return { Products: result };
  } else {
    return null;
  }
};

const multipleProductResolverOutput =
  "type multipleProductResolverOutput { Products:[Product]}";

const multipleProductResolverInput =
  "input multipleProductResolverInput { id:ID!, ProductName: String!, ProductID: String!,orderQty:Int!, Price: Int!, MRP: Int! }";

module.exports = {
  multipleProductResolver,
  multipleProductResolverOutput,
  multipleProductResolverInput,
};
