//:: Imports
var express = require("express");
var router = express.Router();
const Razorpay = require("razorpay");

// Razorpay Instance
const rzp = new Razorpay({
  key_id: "rzp_test_MILeyvCy8PQGU4",
  key_secret: "KX1Gw7C0gnMnnDAiMMVhhKLw",
});

router.get("/getOrder", (req, res) => {
  console.log("payment OrderProcessor");
  if (!req.query.amount) {
    res.status(422).send("Amount not specfied");
    return;
  }
  var options = {
    amount: req.query.amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
    payment_capture: "0",
  };
  rzp.orders.create(options, function(err, order) {
    if (err) {
      console.log("error while generating order >> " + err);
    }
    console.log(order);
    res.redirect(
      "http://192.168.1.6:3000/backend/payment/process?amount=" +
        req.query.amount +
        "&orderID=" +
        order.id +
        "&redirectUri=" +
        req.query.redirectUri
    );
  });
});

router.get("/process", (req, res) => {
  console.log("payment Processor");
  if (!req.query.amount || !req.query.orderID || !req.query.redirectUri) {
    res.status(422).send("Cannot Process incomplete Request");
    return;
  }
  console.log("Amount" + req.query.amount);
  console.log("orderID" + req.query.orderID);
  console.log("redirecctURI" + req.query.redirectUri);
  res.render("PaymentView", {
    message: "test message",
    payment: req.query.payment,
    orderID: req.query.orderID,
    redirectUri: req.query.redirectUri,
  });
});

router.post("/success", (req, res) => {
  console.log("payment Success Processor");
  console.log("Request query params >> " + JSON.stringify(req.body));
  res.send("payment success");
});

//::Exports  AddUser($name:String)
module.exports = router;
