const Role = require("../../models/role.model")
const systemCongif = require("../../config/system")

module.exports.index = async (req, res) =>{
    const records = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/roles/index",{
        pageTitle: "Nhóm quyền",
        records: records,
    });
};


//[GET] /admin/roles/create
module.exports.create = (req, res) =>{
    res.render("admin/pages/roles/create",{
        pageTitle: "Thêm mới nhóm quyền"
    });
};

//[POST]/admin/roles/createPost
module.exports.createPost = async (req, res) =>{
    const record = new Role(req.body);
    await record.save();
    res.redirect(`/${systemCongif.prefixAdmin}/roles`);
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) =>{
    try {
        const record = await Role.findOne({
            _id: req.params.id,
            deleted: false
        })
        res.render("admin/pages/roles/edit",{
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record,
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/roles`)
    }
};

//[PATCH]/admin/roles/edit/:id
module.exports.editPatch = async (req, res) =>{
    try {
        await Role.updateOne({
            _id: req.params.id,
            deleted: false,
        },req.body);
        req.flash("Success","Cập nhật sản phẩm thành công");
        res.redirect(`/${systemCongif.prefixAdmin}/roles`);    
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/roles`);
    }
};

//[GET] /admin/roles/permission
module.exports.permission = async (req, res) =>{
    const records = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/roles/permission",{
        pageTitle: "Nhóm quyền",
        records: records,
    });
};

//[PATCH] /admin/roles/permission
module.exports.permissionPatch = async (req, res) => {
    const roles = JSON.parse(req.body.roles);
    try {
        for(const item of roles){
            await Role.updateOne({
                _id: item.id,
            },{
                permissions: item.permission
            });
        }
        req.flash("Success","Cập nhật phân quyền thành công");   
    }catch (error) {
        req.flash("error","Cập nhật phân quyền không thành công");
    }

    res.redirect(`/${systemCongif.prefixAdmin}/roles`)
};

//[DELETE] /admin/roles/delete
module.exports.deleteRole = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({
            _id: id
        },{
            deleted: true,
            deletedAt: new Date(),
        });
        req.flash("Sucess","Xóa bản ghi thành công")    
    } catch (error) {
        console.log("error");
    } finally {
        res.redirect("back");
    }
};