const express = require("express");
const { cartController } = require("../../controllers/index");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/",auth, cartController.getCart);

router.post("/",auth,cartController.addProductToCart )

router.put("/",auth,cartController.updateProductInCart)

router.put("/checkout",auth,cartController.checkout)

router.put('/increase/:productId', auth, cartController.increaseProductQuantity);

router.put('/decrease/:productId', auth, cartController.decreaseProductQuantity);

router.delete('/remove/:productId', auth, cartController.deleteProductInCart );

module.exports = router