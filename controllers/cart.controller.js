const { cartService } = require("../services");
const catchAsync = require("../utils/catchAsync");



const getCart = catchAsync(async (req,res)=>{
    const cart = await cartService.getCartByUser(req.user);
    res.send(cart)
})


const addProductToCart = catchAsync(async (req,res)=>{
    const cart = await cartService.addProductToCart(
        req.user,
        req.body.productId,
        req.body.quantity
    )
    res.status(201).send(cart)
})
const updateProductInCart = catchAsync(async (req,res)=>{
  if(req.body.quantity == 0){
    await cartService.deleteProductInCart(req.user,req.body.productId)
    return res.status(204).send("Deleted successfully")
  }
  const cart = await cartService.updateProductInCart(
        req.user,
        req.body.productId,
        req.body.quantity
  )
  return res.status(200).send(cart)
})
const checkout = catchAsync(async (req,res)=>{
    await cartService.checkout(req.user)
    return res.status(204).send("Checkout successful")
})


const increaseProductQuantity = catchAsync(async (req,res)=>{
    const cart = await cartService.increaseProductQuantity(req.user,req.params.productId)
    return res.status(200).send(cart)
})

const decreaseProductQuantity = catchAsync(async (req,res)=>{
    const cart = await cartService.decreaseProductQuantity(req.user,req.params.productId)
    return res.status(200).send(cart)
})

const deleteProductInCart = catchAsync(async (req,res)=>{
    const cart = await cartService.deleteProductInCart(req.user,req.params.productId)
    return res.status(200).send(cart)
})


module.exports = {
    getCart,
    addProductToCart,
    updateProductInCart,
    checkout,
    increaseProductQuantity,
    decreaseProductQuantity,
    deleteProductInCart
}