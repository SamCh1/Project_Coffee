const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")
const User = require("../../models/user.model")
const ExchangeVoucher = require("../../models/exchange-voucher.model")

//[GET] /checkout
module.exports.index = async(req, res) => {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId,
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
    
    
    res.render("client_v2/pages/order/index", {
        pagetile: "Thanh toán sản phẩm",
        cartDetail: cart,
    });
}

//[POST] /checkout/order
module.exports.order = async(req, res) => {
    const cartId = req.cookies.cartId
    const infoUser = req.body;
    const user = res.locals.user;
    const orderInfo = {
        card_id: cartId,
        userInfo: infoUser,
        products:[],
    } 
    try {
        const cart = await Cart.findOne({
            _id: cartId,
        })
    
        let totalPrice = 0;
    
        for(const product of cart.products){
            const infoProduct = await Product.findOne({
                _id: product.product_id,
            });
    
            //total price
            infoProduct.priceNew = (infoProduct.price * (100 - infoProduct.discountPercentage)/100).toFixed(0);
            product.productInfo = infoProduct;
            product.totalPrice = product.quantity * infoProduct.priceNew;
    
            totalPrice += product.totalPrice;
    
            const objectProduct = {
                product_id: product.product_id,
                price: infoProduct.price,
                discountPercentage: infoProduct.discountPercentage,
                quantity: product.quantity,
                totalPrice: infoProduct.totalPrice
            };
            orderInfo.products.push(objectProduct);
        }
        
        if(infoUser.voucher){
            const vouchers = await ExchangeVoucher.findOne({
                'users.user_id': user.id,
                code: infoUser.voucher,
                status:"active",
            })

            if(!vouchers){
                req.flash("error","Mã voucher không hợp lệ")
                return res.redirect('back');
            }
            const decreasePrice = (totalPrice * (100-vouchers.vouchers[0].discountPercentage)/100).toFixed(0);
            orderInfo.DecreasePrice = decreasePrice;
            orderInfo.discountPercentage = vouchers.vouchers[0].discountPercentage;
            await ExchangeVoucher.updateOne({
                'users.user_id': user.id,
                code: infoUser.voucher,
                status:"active",
            },{
                status: "inactive"
            })
        }

        orderInfo.totalPrice = totalPrice;
        if(user){
            orderInfo.users = {
                user_id: user.id,
                email:user.email
            };
            if(totalPrice >= 100000 && (infoUser.voucher == ""  || !infoUser.voucher)){
                const currentScore =  Math.floor(totalPrice / 100000);
                const Score =  currentScore * 10;
                const TotalScore = Score + user.score;
                await User.updateOne({
                    _id: user.id
                },{
                    score: TotalScore
                })
            }
        }
        const order = new Order(orderInfo)
        await order.save();
    
        await Cart.updateOne({
            _id: cartId,
        },{
            products: [],
        });
        
        res.redirect(`/checkout/success/${order.id}`)
    } catch (error) {
        console.log(error);
        req.flash('error', 'Đã có lỗi xảy ra ! vui lòng thử lại.')
        res.redirect(`back`)
    }
    
}

module.exports.success = async (req,res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
    });

    order.totalPrice = 0;

    for (const item of order.products) {
        const infoProduct = await Product.findOne({
            _id: item.product_id
        });

        item.title = infoProduct.title;
        item.thumbnail = infoProduct.thumbnail;
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        item.totalPrice = item.priceNew * item.quantity;
        order.totalPrice += item.totalPrice;
        await Product.updateOne({
            _id: item.product_id
        },{
            stock: infoProduct.stock - item.quantity,
        });
    }


    res.render("client_v2/pages/order/success",{
        pagetile: "Đặt hàng thành công",
        order: order
    });
}