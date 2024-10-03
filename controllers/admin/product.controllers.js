const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")
const filterStatusHelper = require("../../helpers/filterState.helper");
const paginationHelper = require("../../helpers/pagination.helper")
const systemCongif = require("../../config/system")
const createTreeHelper = require("../../helpers/create-tree.helper")
const Account = require("../../models/account.model")

// [GET] /admin/products/
module.exports.index = async (req, res) =>{
    try{
        const filterState = filterStatusHelper(req.query);
        const find = {
            deleted: false,
        };
    
        if(req.query.status){
            find.status = req.query.status;
        };
    
        //Search
        if(req.query.keyword){
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex;
            // reExp: "so khớp chuỗi , 'i' là so khớp không phân biệt hoa hay thường "
        }
        //End search
    
        //Pagination
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts);
        //End Pagination
    
        //sort
        const sort={};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort["position"] = "desc";
        }
        //End sort

        const products = await Product.find(find)
            .sort(sort)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
    

        for (const product of products){
            const account = await Account.findOne({
                _id: product.createdBy.accountID
            });

            if(account){
                product.createdBy.fullName = account.fullName;
            }else{
                delete product.createdBy
            }
        }
        res.render("admin/pages/products/index",{
            pageTitle: "Danh sách sản phẩm",
            products: products,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
        });
    } catch (error){
        console.log(error);
        res.redirect(`/${systemCongif.prefixAdmin}/products`);
    }

};

//[PATH] //admin/products/chang-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash('Success','Cập nhật trạng thái thành công!');
    res.redirect(`back`);
}

//[PATH] //admin/products/chang-status/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch(type){
        case "active":
        case "inactive":    
            await Product.updateMany({
                _id: { $in: ids }
            }, {
                status: type
            });

            req.flash('Success','Cập nhật trạng thái thành công!');
            break;
        case "delete-all":
            await Product.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash('Success','Xóa sản phẩm thành công!');
            break;
        case "change-position":
           for (const item of ids){
            let [id, position] = item.split("-");
            position = parseInt(position);
            await Product.updateOne({
                _id: id
            },{
                position: position
            });
           }
            req.flash('Success','Thay đổi vị trí thành công!');
            break;
        default:
            break;
    }

    res.redirect("back");
}

//[DELETE] //admin/products/delete/id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        // xóa cứng
        // await Product.deleteOne({
        //     _id: id
        // });
        
        // xóa mềm
        await Product.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        req.flash('Success','Xóa sản phẩm thành công!');
    } catch (error) {
        console.log(error);
    }finally{
        res.redirect("back");
    }
}

//[GET] //admin/products/create
module.exports.create = async(req, res) => {
    const records = await ProductCategory.find({
        deleted: false,
    });

    const newRecords= createTreeHelper(records);

    res.render("admin/pages/products/create", {
        pageTitle: "thêm mới sản phẩm",
        records: newRecords,
    });
}

//[POST] //admin/products/createPost
module.exports.createPost = async(req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        accountID: res.locals.user.id,
    };

    // if(req.file && req.file.filename){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    const product = new Product(req.body); //tạo mới 1 sản phẩm
    await product.save(); // lưu vào database
    req.flash("Success","Thêm mới sản phẩm thành công");
    res.redirect(`/${systemCongif.prefixAdmin}/products`);
};

//[POST] //admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        
        const records = await ProductCategory.find({
            deleted: false,
        });
    
        const newRecords= createTreeHelper(records);
        
        res.render(`admin/pages/products/edit.pug`,{
           pageTitle: "chỉnh sửa sản phẩm",
           product: product,
           records: newRecords,
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/products`);
    }
};

//[PATCH] //admin/products/editPatch/
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        
        if(req.file && req.file.filename){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        await Product.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        req.flash("Success","Cập nhật sản phẩm thành công");
        res.redirect("back");    
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/products`);
    }
}

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        
        
        res.render(`admin/pages/products/detail.pug`,{
           pageTitle: "chi tiết sản phẩm",
           product: product 
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/products`);
    }
};