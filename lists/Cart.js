const {
  Text,
  Relationship,
  Select,
  Integer,
  DateTime,
} = require("@keystonejs/fields");

module.exports = {
  fields: {
    status: {
      type: Select,
      options: "active, ordered, delivered, test",
      isRequired: true,
    },
    cartProducts: {
      type: Relationship,
      ref: "cartProduct",
      many: true,
    },
    user: {
      type: Relationship,
      isRequired: true,
      ref: "User.cart",
    },
    deliveryAddress: {
      type: Relationship,
      ref: "Address",
      isRequired: true,
    },
    cartPrice: {
      type: Integer,
      /*  isRequired: true, */
    },
    cartOrderTime: {
      type: DateTime,
      /*  isRequired: true, */
    },
  },
  labelField: "User",
};

/* mutation{
  createCart(data:{
    status:test,
    cartProducts:{ 
      create: [
        {
          Product:{connect:{id:"5ec0c6d1f4836e3ca44afd90"}},
          orderQty:80
        },
        {
          Product:{connect:{id:"5ec0c6d1f4836e3ca44afd2b"}},
          orderQty:8
        }
      ]
    }
  }){
    id
  }
} */

/* mutation($products:[CartProductsCreateInput!]!){
  createCartProducts(data:$products){
    id
  }
} */

/* {"products":[
  {
    "data": {
      "Product":{"connect":{"id":"5ec0c6d1f4836e3ca44afd90"}},
   		"orderQty":8 
    }
  },{
    "data":{
      "Product": {"connect": {"id": "5ec0c6d1f4836e3ca44afd38" } },
      "orderQty": 12
    }
  }
]} */
