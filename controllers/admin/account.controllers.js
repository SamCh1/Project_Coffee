const Account = require("../../models/account.model")
const systemCongif = require("../../config/system")
const generateHelper = require("../../helpers/generate.helper")
const Role = require("../../models/role.model")
const md5 = require('md5');

//[GET] /admin/accounts
module.exports.index = async (req, res) =>{
    //Find
    let find = {
        deleted: false,
    };
    //End find
    const records = await Account.find(find);

    for (const record of records) {
      const role = await Role.findOne({
        _id: record.role_id
      });
      record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
    });
}
//[GET] /admin/accounts/create
module.exports.create = async (req, res) =>{
    const roles = await Role.find({
        deleted: false
    });

    console.log(roles);

    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: roles,
    })
}
//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) =>{
    req.body.token = generateHelper.generateRandomString(30);
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`/${systemCongif.prefixAdmin}/accounts`);
}

//[GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false,
    };
    try {
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false,
        });
        
        res.render("admin/pages/accounts/edit",{
            pageTitle: "Chỉnh sửa sản phẩm",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/accounts`);
    }
    
}

//[PATCH] /admin/accounts/edit
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if(req.body.password) {
        req.body.password = md5(req.body.password);
  } else {
        delete req.body.password;
  }

  await Account.updateOne({
        _id: id
  }, req.body);

  res.redirect("back");
}

//[DELETE] /admin/delete/id
module.exports.deleteAccount = async (req, res) => {
    try {
        const id = req.params.id;
        await Account.updateOne({
            _id: id,
        },{
            deleted: true,
            deletedAt: new Date(),
        });
        req.flash('Success',"Xóa tài khoản thành công");
    } catch (error) {
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
        await Account.updateOne({
            _id: id,
            deleted: false,
        },{           
            status: status,
        });
        req.flash('Success',"Cập nhật tài khoản thành công");
    } catch (error) {
        console.log("error")  
    } finally {
        res.redirect("back");
    }
}