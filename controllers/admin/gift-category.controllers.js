const GiftCategory = require("../../models/gift-category.models")
const createTreeHelper = require("../../helpers/create-tree.helper")
const systemCongif = require("../../config/system")
//[GET] admin/product-category
module.exports.index = async (req, res) =>{
    const records = await GiftCategory.find({
        deleted: false,
    });

    const newRecords= createTreeHelper(records);

    res.render("admin/pages/gifts-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    })    
    
};

//[GET] admin/product-category/create
module.exports.create = async (req, res) =>{
    const records = await GiftCategory.find({
        deleted: false,
    });

    res.render("admin/pages/gifts-category/create", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: records
    })   
};

//[POST] admin/product-category/create
module.exports.createPost = async (req, res) =>{
    if(req.body.position == ""){
        const countRecord = await GiftCategory.countDocuments();
        req.body.position = countRecord + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new GiftCategory(req.body);
    await record.save();

    req.flash("success","Thêm mới danh mục sản phẩm thành công");
    res.redirect(`/${systemCongif.prefixAdmin}/gifts-category`)
};

//[GET] admin/product-category/edit/id
module.exports.edit = async (req, res) =>{
    try {
        const data = await GiftCategory.findOne({
            _id: req.params.id,
            deleted: false,
        })
        
        const records = await GiftCategory.find({
            deleted: false,
        });
    
        res.render("admin/pages/gifts-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: records
        });   
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/gifts-category`)
    }
    
};

//[PATCH] admin/product-category/edit/id
module.exports.editPatch = async (req, res) =>{
    try {
        if(req.body.position == ""){
            const countRecord = await GiftCategory.countDocuments();
            req.body.position = countRecord + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
    
        await GiftCategory.updateOne({
            _id: req.params.id,
            deleted: false,
        },req.body)
    
        req.flash("success","Cập nhật danh mục sản phẩm thành công");
        res.redirect(`back`);
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/gifts-category`)
    }

};

//[PATCH] admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await GiftCategory.updateOne({
        _id: id,
    },{
        status: status
    })
    req.flash('Success','Cập nhật trạng thái thành công!');
    res.redirect(`back`);
}

//[DELETE] admin/product-category/delete/id
module.exports.deleteItem = async (req, res) => {
    try{
        const id = req.params.id
        await GiftCategory.updateOne({   
            _id: id,
        },{
            deleted: true,
            deletedAt: new Date()
        });
        req.flash('Success', 'Xóa sản phẩm thành công');
    } catch(error) {
        console.log(error);
    } finally{
        res.redirect("back");
    }
}