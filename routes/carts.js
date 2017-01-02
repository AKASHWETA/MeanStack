var express = require('express');
var router = express.Router();
var cache = require('memory-cache');
/*We can use session here and in real scenario i will prefer memcache */
  


/*
 * GET itemList.
 */
router.get('/itemlist', function(req, res) {
    /*hardcoded user1  in real scenario we will use email id or session id*/
        res.json(cache.get('user1'));
});

/* POST to Item Service */
router.post('/addtocart', function(req, res) {
   var existingItem;
   var requestData = req.body.cart;
   var  cart = cache.get('user1')!=null ? cache.get('user1') : [];
   var j = 0;
  
   if(requestData!=undefined){
      for(j in requestData){
        var jasonData = JSON.stringify(requestData[j]);
        var jasonObj = JSON.parse(jasonData);
       
        if(cart.length>0) {
          existingItem = itemExists(cart,jasonObj.ItemNumber,jasonObj.Quantity,jasonObj.Price,"ADD");
          if(existingItem == undefined){
              cart.push(JSON.parse(jasonData));
          }
        }else{
          cart.push(JSON.parse(jasonData));
        }
      }
    /*hardcoded user1 in real scenario we will use email id or session id */
       cache.put('user1', cart);
    }
  
   res.redirect("itemlist");
});



/*Check if Item exist in a cart*/
function itemExists(cart,itemNumber,quantity,price,action) {
   var i = 0;
  for (i in cart) {
      if(cart[i].ItemNumber == itemNumber){
        if(action =="ADD"){
          cart[i].Quantity+=quantity;
          cart[i].Price+= (quantity * price);
        }else{
          var unitprice = cart[i].Price/cart[i].Quantity;
           cart[i].Quantity -=1;
           cart[i].Price -=unitprice;
        }
        return cart[i];
      }
    }
}


function loopThroughRequest(){


}
/*Delete item from Cart*/
router.delete('/removeitem', function (req, res) {
  var  cart = cache.get('user1');
  itemExists(cart,req.body.ItemNumber,req.body.Quantity,0,"REMOVE");
  var newcart = cart.filter(function (el) {
    return el.Quantity>0;
  });
  cache.put('user1', newcart);
  res.send('Got a DELETE request at /user');
});

/*Clear cart*/
router.put('/clear', function (req, res) {
  console.log("Coming inside");
  cache.put('user1',[]);
   res.send('cart is empty');
});
module.exports = router;

