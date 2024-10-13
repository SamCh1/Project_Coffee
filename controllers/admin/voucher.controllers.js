const Voucher = require("../../models/voucher.models");
const GiftCategory = require("../../models/gift-category.models")
const filterStatusHelper = require("../../helpers/filterState.helper");
const paginationHelper = require("../../helpers/pagination.helper")
const systemCongif = require("../../config/system")
const createTreeHelper = require("../../helpers/create-tree.helper")
const Account = require("../../models/account.model")

// [GET] /admin/vouchers/
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
        const countVouchers = await Voucher.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countVouchers);
        //End Pagination
    
        //sort
        const sort={};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort["position"] = "desc";
        }
        //End sort

        const vouchers = await Voucher.find(find)
            .sort(sort)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
    

        for (const product of vouchers){
            const account = await Account.findOne({
                _id: product.createdBy.accountID
            });

            if(account){
                product.createdBy.fullName = account.fullName;
            }else{
                delete product.createdBy
            }
        }
        res.render("admin/pages/vouchers/index",{
            pageTitle: "Danh sách sản phẩm",
            vouchers:vouchers,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
        });
    } catch (error){
        console.log(error);
        res.redirect(`/${systemCongif.prefixAdmin}/vouchers`);
    }

};

//[PATH] //admin/vouchers/chang-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Voucher.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash('Success','Cập nhật trạng thái thành công!');
    res.redirect(`back`);
}

//[PATH] //admin/vouchers/chang-status/:status/:id
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
            await Voucher.updateMany({
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
            await Voucher.updateOne({
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

//[DELETE] //admin/vouchers/delete/id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        // xóa cứng
        // await Product.deleteOne({
        //     _id: id
        // });
        
        // xóa mềm
        await Voucher.updateOne({
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

//[GET] //admin/vouchers/create
module.exports.create = async(req, res) => {
    const records = await GiftCategory.find({
        deleted: false,
    });

    const newRecords= createTreeHelper(records);

    res.render("admin/pages/vouchers/create", {
        pageTitle: "thêm mới sản phẩm",
        records: newRecords,
    });
}

//[POST] //admin/vouchers/createPost
module.exports.createPost = async(req, res) => {
    req.body.score = parseInt(req.body.score);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
    if(req.body.position == ""){
        const countVouchers = await Voucher.countDocuments();
        req.body.position = countVouchers + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        accountID: res.locals.user.id,
    };

    // if(req.file && req.file.filename){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    const voucher = new Voucher(req.body); //tạo mới 1 sản phẩm
    await voucher.save(); // lưu vào database
    req.flash("Success","Thêm mới sản phẩm thành công");
    res.redirect(`/${systemCongif.prefixAdmin}/vouchers`);
};

//[POST] //admin/vouchers/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const voucher = await Voucher.findOne({
            _id: id,
            deleted: false
        });
        
        const records = await GiftCategory.find({
            deleted: false,
        });
    
        const newRecords= createTreeHelper(records);
        
        res.render(`admin/pages/vouchers/edit.pug`,{
           pageTitle: "chỉnh sửa sản phẩm",
           voucher: voucher,
           records: newRecords,
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/vouchers`);
    }
};

//[PATCH] //admin/vouchers/editPatch/
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.score = parseInt(req.body.score);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        
        if(req.file && req.file.filename){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        await Voucher.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        req.flash("Success","Cập nhật sản phẩm thành công");
        res.redirect("back");    
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/vouchers`);
    }
}

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Voucher.findOne({
            _id: id,
            deleted: false
        });
        
        
        res.render(`admin/pages/vouchers/detail.pug`,{
           pageTitle: "chi tiết sản phẩm",
           product: product 
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/vouchers`);
    }
};