const SettingGeneral = require("../../models/settings-general.model")

//[GET] /admin/setting/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/setting/general", {
        pagetitle: "Cài đặt chung",
        settingGeneral: settingGeneral,
    });
};

//[PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id,
        }, req.body);
    }else{
        const record = new SettingGeneral(req.body);
        await record.save();
    }
    res.redirect("back");
};