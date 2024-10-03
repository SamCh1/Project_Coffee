const product = require("../../models/product.model")

//[GET]
module.exports.index = async (req, res) =>{
    //Outstanding products
    const productFeatured = await product.find({
        featured: "1",
        status: "active",
        deleted: false,
    }).sort({ position: "desc" }).limit(6);
    
    for (const item of productFeatured) {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }
    console.log(productFeatured.priceNew);
    //Lasted products
    const productNew = await product.find({
        status: "active",   
        deleted: false,
    }).sort({ position: "desc" }).limit(6);
    
    for (const item of productNew) {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }

    res.render("client_v2/pages/home/index",{
        pageTitle: "Trang chủ",
        productFeatured: productFeatured,
        productNew: productNew
    });
};

