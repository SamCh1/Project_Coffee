const Voucher = require("../../models/voucher.models");
const Gift = require("../../models/gift.models");
const GiftCategory = require("../../models/gift-category.models")

// [GET] /gift/
module.exports.index = async (req, res) => {
    try {

        //sort
        const sort={};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort["position"] = "desc";
        }

        const gifts = await Gift.find({
            status: "active",
            deleted: false
        }).sort(sort);
    
        // for (const item of gifts){
        //     item.priceNew = item.price * (1 - item.discountPercentage/100);
        //     item.priceNew = item.priceNew.toFixed(0);
        // }
    
        const vouchers = await Voucher.find({
            status: "active",
            deleted: false
        }).sort({ position: "asc"});

        const allCategories = await GiftCategory.find({
            status: "active",
            deleted: false
        }).sort({ position: "asc"});

        res.render("client_v2/pages/gift/index",{
            pageTitle: "Trang danh sách sản phẩm",
            gifts: gifts,
            vouchers: vouchers,
            allCategory: allCategories
        });
    
    } catch (error) {
        console.log(error);
        res.redirect(`/products`)
    }
    //End sort
}

//[GET] /product/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })

        product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
        
        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
            });

            product.category = category;
        }


        res.render("client_v2/pages/gift/detail",{
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect("/");
    }

    //
}


//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
        slug: slugCategory,
        status: "active",
        deleted: false,
    });

    const cat = await ProductCategory.find({
        slug: slugCategory,
        status: "active",
        deleted: false,
    });

    const getSubCategory = async (parentID) => {        // hàm đệ quy tìm toàn các phần tử con 
        const sub = await ProductCategory.find({
            parent_id: parentID,
            status: "active",
            deleted: false,
        });
        
        let allSubs = [...sub];
        
        for(const item of sub){
            const childs = await getSubCategory(item.id);
            allSubs = allSubs.concat(childs);
        }

        return allSubs;
    }

    const allCategories = await ProductCategory.find({
        status: "active",
        deleted: false
    }).sort({ position: "asc"});

    const allCategory = await getSubCategory(category.id);

    const allCategoryId = allCategory.map(item => item.id);

    const product = await Product.find({
        product_category_id: { $in: [category.id, ...allCategoryId] },
        status: "active",
        deleted: false
    }).sort({ position: "desc"} );
    for (const item of product) {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }

    res.render("client_v2/pages/gift/index",{
        pageTitle: "Trang danh sách sản phẩm",
        products: product,
        category: cat,
        allCategory: allCategories
    });
}

//[PATCH] /gifts/exchange/voucher/:id
module.exports.exchangeVoucher = async (req, res) => {
    res.send("ok");
}