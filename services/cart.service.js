const config = require("../config/config")
const { Cart, Product } = require("../models/index")


const getCartByUser = async (user)=>{
    let cart = await Cart.findOne({email:user.email})
    if(cart === null){
        throw new Error("User does not have a cart")
    }
    return cart
}

const addProductToCart = async (user,productId,quantity)=>{
    let cart = await Cart.findOne({email:user.email});
    if(!cart){
        try {
           cart = await Cart.create({
            email:user.email,
            cartItems:[],
            paymentOption :config.default_payment_option
           }) 
        } catch (error) {
            return { success: false, message: "User cart creation failed, already have a cart" };
        }
    }
    if(cart === null){
        return { success: false, message: "User does not have a cart" };
    }
    let productIndex = -1;
    for (let i = 0;i < cart.cartItems.length;i++){
        if(productId == cart.cartItems[i].product._id){
            productIndex = i
        }
    }
    if(productIndex == -1){
        let product =await Product.findOne({_id:productId});
        if(product == null) {
            return { success: false, message: "Product does not exist in database" };
        }
        cart.cartItems.push({product:product,quantity:quantity})
    } else {
        return { success: false, message: "Product already in the cart" };
    }

    await cart.save()
    return { success: true, cart: cart };
}

const updateProductInCart = async (user, productId,quantity)=>{
    let cart = await Cart.findOne({email:user.email})
    if(cart == null){
        return { success: false, message: "User does not have a cart" };
    }

    let product = await Product.findOne({_id:productId})
    if(product == null){
        return { success: false, message: "Product does not exist" };
    }
    let productIndex = -1;
    for (let i = 0;i < cart.cartItems.length;i++){
        if(productId == cart.cartItems[i].product._id){
            productIndex = i
        }
    }
    if(productIndex == -1){
        return { success: false, message: "Product not in cart" };
    } else {
        cart.cartItems[productIndex].quantity = quantity;
    }
    await cart.save()
    return { success: true, cart: cart };
}

const deleteProductInCart = async (user,productId)=>{
    let cart = await Cart.findOne({email:user.email})
    if(cart == null){
        return { success: false, message: "User does not have a cart" };
    }
    let productIndex = -1;
    for (let i = 0;i < cart.cartItems.length;i++){
        if(productId == cart.cartItems[i].product._id){
            productIndex = i
        }
    }
    if(productIndex == -1){
        return { success: false, message: "Product does not exist for this user" };
    } else {
        cart.cartItems.splice(productIndex,1)
    }
    await cart.save()
    return { success: true, message: "Product removed from cart" };
}

const checkout = async (user)=>{
    let cart = await Cart.findOne({email:user.email})
    if(cart == null){
        throw new Error("User does not have a cart")
    }
    
    if(cart.cartItems.length === 0){
        throw new Error("Cart is empty")
    }

    if(user.address == config.default_address){
        throw new Error("Address not set")
    }

    let total = 0;
    for(let i =0;i<cart.cartItems.length;i++){
        total += cart.cartItems[i].product.cost * cart.cartItems[i].quantity;
    }
    if(total > user.walletMoney){
       throw new Error("User has insufficient money to process")
    }
    
    user.walletMoney -= total;
    await user.save();

    cart.cartItems = [];
    await cart.save();
    return { success: true, message: "Checkout successful" };

}

const increaseProductQuantity = async (user, productId) => {
    let cart = await Cart.findOne({email: user.email});
    if(cart == null){
        return { success: false, message: "User does not have a cart" };
    }

    let productIndex = -1;
    for (let i = 0; i < cart.cartItems.length; i++){
        if(productId == cart.cartItems[i].product._id){
            productIndex = i;
        }
    }
    
    if(productIndex == -1){
        return { success: false, message: "Product not in cart" };
    } else {
        cart.cartItems[productIndex].quantity += 1;
    }
    
    await cart.save();
    return { success: true, cart: cart };
}

const decreaseProductQuantity = async (user, productId) => {
    let cart = await Cart.findOne({email: user.email});
    if(cart == null){
        return { success: false, message: "User does not have a cart" };
    }

    let productIndex = -1;
    for (let i = 0; i < cart.cartItems.length; i++){
        if(productId == cart.cartItems[i].product._id){
            productIndex = i;
        }
    }
    
    if(productIndex == -1){
        return { success: false, message: "Product not in cart" };
    } else {
        if(cart.cartItems[productIndex].quantity > 1) {
            cart.cartItems[productIndex].quantity -= 1;
        } else {
            return { success: false, message: "Quantity cannot be less than 1" };
        }
    }
    
    await cart.save();
    return { success: true, cart: cart };
}

module.exports = {
    getCartByUser,
    addProductToCart,
    updateProductInCart,
    deleteProductInCart,
    checkout,
    increaseProductQuantity,
    decreaseProductQuantity
}

