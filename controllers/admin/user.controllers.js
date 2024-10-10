const User = require("../../models/user.model")
const paginationHelper = require("../../helpers/pagination.helper")
const filterStatusHelper = require("../../helpers/filterState.helper")
const systemCongif = require("../../config/system")


//[Get] /admin/users
module.exports.index = async (req,res) => {    
    try {
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
            find.email = regex;
            // reExp: "so khớp chuỗi , 'i' là so khớp không phân biệt hoa hay thường "
        }

        /*Pagination */
        const countUser = await User.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countUser);

        console.log(find);
        const user = await User.find(find)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
        

        res.render("admin/pages/users/index.pug",{
            title:"Trang thông tin khách hàng",
            user: user,
            pagination: objectPagination,
            filterState: filterState,
            keyword: req.query.keyword
        });


    } catch (error) {
        console.log(error);
        res.redirect(`/${systemCongif.prefixAdmin}/products`);
    }
}

//[GET] /admin/users/edit/:id
module.exports.edit = async(req, res) => {
    const find = {
        _id: req.params.id,
        deleted:false,
    };
    try {
        const data = await User.findOne(find);

        res.render("admin/pages/users/edit", {
            pageTitle: "Chỉnh sửa tài khoản khách hàng",
            data: data,
        })
    } catch (error) {
        req.flash('error',"Không thể truy cập!");
        res.redirect(`/${systemCongif.prefixAdmin}/users`);
    }
}

//[PATCH] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        await User.updateOne({
            _id: id
        }, req.body);
        req.flash('Success',"Cập nhật tài khoản thành công");
        res.redirect("back");   
    } catch (error) {
        req.flash('error',"Cập nhật tài khoản thất bại");
        res.redirect("back"); 
    }
} 

//[DELETE] /admin/delete/id
module.exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await User.updateOne({
            _id: id,
        },{
            deleted: true,
            deletedAt: new Date(),
        });
        req.flash('Success',"Xóa tài khoản thành công");
    } catch (error) {
        req.flash('error',"Xóa tài khoản thất bại");
        console.log("error")  
    } finally {
        res.redirect("back");
    }
}

//[PATCH] /admin/change-status/status/id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        await User.updateOne({
            _id: id,
            deleted: false,
        },{           
            status: status,
        });
        req.flash('Success',"Cập nhật tài khoản thành công");
    } catch (error) {
        req.flash('error',"Cập nhật tài khoản thất bại");
        console.log("error")  
    } finally {
        res.redirect("back");
    }
}