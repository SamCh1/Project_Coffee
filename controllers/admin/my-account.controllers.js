const systemCongif = require("../../config/system")
const Account = require("../../models/account.model")
const md5 = require("md5");

//[GET] /admin/my-account
module.exports.index = (req,res) =>{
    res.render("admin/pages/my-accounts/index", {
        pageTile: "Thông tin cá nhân",
    })
}

//[GET] /admin/my-account/edit
module.exports.edit = (req,res) =>{
    res.render("admin/pages/my-accounts/edit", {
        pageTile: "Chỉnh sửa thông tin cá nhân",
    });
}

//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req,res) =>{
  const id = res.locals.user.id

  if(req.body.password){
    req.body.password = md5(req.body.password);
  }else{
    delete req.body.password;
  }

  await Account.updateOne({
    _id: id
  }, req.body);

  res.redirect("back")
}