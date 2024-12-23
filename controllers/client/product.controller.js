const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model") 
const Comment = require("../../models/comment.model")
const paginationHelper = require("../../helpers/pagination.helper")

// [GET] /product/
module.exports.index = async (req, res) => {
    try {
        //sort
        const sort={};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort["position"] = "desc";
        }

        const products = await Product.find({
            status: "active",
            deleted: false
        }).sort(sort);
    
        for (const item of products){
            item.priceNew = item.price * (1 - item.discountPercentage/100);
            item.priceNew = item.priceNew.toFixed(0);
        }
    
        const categories = await ProductCategory.find({
            status: "active",
            deleted: false
        }).sort({ position: "asc"});

        const allCategories = await ProductCategory.find({
            status: "active",
            deleted: false
        }).sort({ position: "asc"});

        res.render("client_v2/pages/product/index",{
            pageTitle: "Trang danh sách sản phẩm",
            products: products,
            category: categories,
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

        const countComments = await Comment.countDocuments({
            'product.product_id': product.id,  
            deleted: false,
        });
        const objectPagination = paginationHelper(3, req.query, countComments);
        const comment = await Comment.find({
            'product.product_id': product.id,  
            deleted: false,
        }).limit(objectPagination.limitItem).skip(objectPagination.skip).sort({ createdAt: -1 });

        res.render("client_v2/pages/product/detail",{
            pageTitle: product.title,
            product: product,
            comment: comment,
            pagination: objectPagination
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

    res.render("client_v2/pages/product/index",{
        pageTitle: "Trang danh sách sản phẩm",
        products: product,
        category: cat,
        allCategory: allCategories
    });
}

//[POST] /detail/rating/:slug
module.exports.comment = async (req,res) => {
    try{
        const data = req.body;
        const rating = parseInt(data.rating);
        const content = data.comment;
        const slugProduct =  req.params.slug;
        const user = res.locals.user;
        if(!user){
            req.flash("error", "bạn cần đăng nhập để có thể bình luận!");
            return res.redirect('back');
        }
    
        const ProductId = await Product.findOne({
            slug: slugProduct,
            deleted: false,
            status: "active"
        })
        const comment = {
            users:{
                user_id: user.id,
                fullName: user.fullName
            },
            product:{
                product_id: ProductId.id
            },
            rating: rating,
            comment: content,
            createdBy:{
                accountID:user.id
            }
        }
        const feedback = new Comment(comment); //tạo mới 1 sản phẩm
        await feedback.save();
        req.flash("Success","Cám ơn bạn đã đánh giá cho sản phẩm chúng tôi!")
        res.redirect("back");
    }catch(error){
        console.log(error);
        req.flash("error","Đã xảy ra vấn đề, vui lòng thử lại sau!")
        res.redirect("back");
    }
    
}