const Voucher = require("../../models/voucher.models");
const Gift = require("../../models/gift.models");
const GiftCategory = require("../../models/gift-category.models")
const ExchangeVoucher = require("../../models/exchange-voucher.model")
const ExchangeGift = require("../../models/exchang-gift.model")
const User = require("../../models/user.model")
const generate = require("../../helpers/generate.helper")

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


//[GET] /gift/:slugCategory
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

//[POST] /gifts/exchange/voucher/:id
module.exports.exchangeVoucher = async (req, res) => {
    try {
        const user = res.locals.user;
        const voucherId = req.params.id;

        if (!user) {
            req.flash("error", "Có lỗi trong quá trình lấy thông tin tài khoản");
            return res.redirect('back');
        }

        const voucher = await Voucher.findOne({
            _id: voucherId,
            deleted: false,
            status: "active"
        });

        if (!voucher) {
            req.flash("error", "Hiện tại không lấy được voucher");
            return res.redirect('back');
        }


        if (user.score < voucher.score) {
            req.flash("error", "Số điểm của bạn không đủ");
            return res.redirect('back');
        }


        const code = generate.generateRandomCode(10);
        const scoreTotal = user.score;
        const scoreCurrent = user.score - voucher.score;

        const exchangeData = {
            code: code,
            status: "active",
            scoreUsed: voucher.score,
            scoreTotal:scoreTotal,
            scoreCurrent: scoreCurrent,
            vouchers: {
                voucher_id: voucher.id,
                thumbnail: voucher.thumbnail,
                score: voucher.score,
                discountPercentage: voucher.discountPercentage,
            },
            users: {
                user_id: user.id,
                email: user.email,
                score: user.score,
            }
        };

        const newExchangeVoucher = new ExchangeVoucher(exchangeData);
        await newExchangeVoucher.save();

        // Update user's score
        await User.updateOne(
            { _id: user.id },
            { score: scoreCurrent }
        );

        // Redirect back with success message
        req.flash("Success", "Đổi mã giảm giá thành công");
        return res.redirect('back');

    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra trong quá trình đổi voucher");
        return res.redirect('back');
    }
};


//[POST] /gifts/exchange/gift/:id
module.exports.exchangeGift = async (req, res) => {
    try {
        const user = res.locals.user;
        const GiftId = req.params.id;

        if (!user) {
            req.flash("error", "Có lỗi trong quá trình lấy thông tin tài khoản");
            return res.redirect('back');
        }

        const gift = await Gift.findOne({
            _id: GiftId,
            deleted: false,
            status: "active"
        });

        if (!gift) {
            req.flash("error", "Hiện tại không thể lấy được phần thưởng này");
            return res.redirect('back');
        }


        if (user.score < gift.score) {
            req.flash("error", "Số điểm của bạn không đủ");
            return res.redirect('back');
        }

        const scoreTotal = user.score;
        const scoreCurrent = user.score - gift.score;

        const exchangeData = {
            status: "active",
            scoreUsed: gift.score,
            scoreTotal:scoreTotal,
            scoreCurrent: scoreCurrent,
            gifts: {
                gift_id: gift.id,
                score: gift.score,
                title: gift.title,
                thumbnail: gift.thumbnail,
                description: gift.description,
            },
            users: {
                user_id: user.id,
                email: user.email,
                score: user.score,
            }
        };

        const newExchangeGift = new ExchangeGift(exchangeData);
        await newExchangeGift.save();

        // Update user's score
        await User.updateOne(
            { _id: user.id },
            { score: scoreCurrent }
        );

        // Redirect back with success message
        req.flash("Success", "Đổi Phần thưởng thành công");
        return res.redirect('back');

    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra trong quá trình đổi phần thưởng");
        return res.redirect('back');
    }
};