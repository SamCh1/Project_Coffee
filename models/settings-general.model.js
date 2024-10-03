const mongoose = require("mongoose");

const settingGeneralSchelma = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        copyright: String,
    },
    {
        timestamps: true,
    }
);

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchelma, "settings-general");
module.exports = SettingGeneral;