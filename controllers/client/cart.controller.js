const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")


//[GET] /cart/
module.exports.index = async (req,res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId 
    });

    cart.totalPrice = 0;
    
    if(cart.products.length > 0){
        for(const item of cart.products){
            const product = await Product.findOne({
                _id: item.product_id
            }).select("thumbnail title slug price discountPercentage")
            product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
            item.productInfo = product;
            item.totalPrice = item.quantity * product.priceNew;
            cart.totalPrice += item.totalPrice;        
        }
    }
    res.render("client_v2/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
};

//[POST]
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    try {
        const cart = await Cart.findOne({
            _id: cartId
        });
        
        const existProductInCart = cart.products.find(item => item.product_id == productId);

        if(existProductInCart){
            const quantityNew = existProductInCart.quantity + quantity;

            await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId
            },{
                $set: { "products.$.quantity": quantityNew }
            });
        }else{
            const objectCart = {
                product_id: productId,
                quantity: quantity,
            };

            await Cart.updateOne(
                {
                    _id: cartId
                }, {
                    $push: { products: objectCart },
                }
            )
        }
        req.flash("Success", "Đã thêm sản phẩm vào giỏ hàng!");
    }catch(error){
        req.flash("error","Thêm sản phẩm thất bại");
    }
    res.redirect("back");
};

module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    console.log(cartId)
    console.log(productId)

    await Cart.updateOne({
        _id: cartId,
    },{
        $pull: { products: { product_id: productId} }
    })

    req.flash("Success", "Đã xóa sản phẩm")
    res.redirect("back");
}

module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: { "products.$.quantity": quantity }
    });
    req.flash("Success","Cập nhật số lượng thành công")

    res.redirect("back");
};