const md5 = require("md5");
const User = require("../../models/user.model")
const Cart = require("../../models/cart.model")
const ForgotPassword = require("../../models/forgot-password.models") 
const generate = require("../../helpers/generate.helper")
const sendMailHelper = require("../../helpers/send-mail.helper")
//[GET] /user/register
module.exports.register = (req,res) => {
    res.render("client/pages/user/register", {
        pagetitle: "Trang đăng ký"
    })
}

//[POST] /user/register
module.exports.registerPost = async (req,res) =>{
    const existUser = await User.findOne({
        email: req.body.email,
        deleted: false,
    });
    
    if(existUser){
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }

    const infoUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        tokenUser: generate.generateRandomString(30),
    };
    
    const user = new User(infoUser);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

//[GET] /user/login
module.exports.login = (req,res) => { 
    res.render("client_v2/pages/user/login")
}

//[POST] /user/login
module.exports.loginPost = async (req,res) => { 
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if(!user){
        req.flash("error","Email không tồn tại!");
        res.redirect("back");
        return;
    }
    
    if(md5(req.body.password) !== user.password){
        req.flash("error","Sai mật khẩu!");
        res.redirect("back");
        return;
    }
    
    if(user.status !== "active"){
        req.flash("error","Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);
    
    await Cart.updateOne({
        _id: req.cookies.cartid
    },{
        user_id: user.id
    });

    res.redirect("/")
}

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
};

//[GET] /user/password/forgot
module.exports.forgotPassword =  (req, res) => {
    res.render("client/pages/user/forgot-password.pug")
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false,
    })

    if(!user){
        req.flash("error","Email không tồn tại!");
        res.redirect("back");
        return;
    }

    const otp = generate.generateRandomNumber(8);

    // save information into database
    const objectForgotPassword = {
        email: email,
        otp: otp,
    };


    const record = new ForgotPassword(objectForgotPassword);
    await record.save();

    // Send OTP code to email
    const subject = `Mã xác minh OTP lấy lại mật khẩu`;
    const content = `Mã OTP của bạn là <b>${otp}</b>. Vui lòng không chia sẻ ra bên ngoài`
    
    sendMailHelper.sendMail(email, subject, content);
    res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otpPassword = (req,res) => {
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pagetile: "Nhập mã OTP",
        email: email,
    })
}

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req,res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const find = {
        email: email,
        otp: otp,
    };

    const result = await ForgotPassword.findOne(find);
    
    if(!result){
        req.flash("error", "OTP không hợp lệ!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });
    
    res.cookie("tokenUser", user.tokenUser);

    res.redirect(`/user/password/reset`);
}


//[GET] /user/password/reset
module.exports.resetPassword = (req,res) =>{
    res.render("client/pages/user/reset-password", {
        pagetitle: "Đổi mật khẩu",
    });
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req,res) =>{
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    try {
        await User.updateOne({
            tokenUser: tokenUser
        }, {
            password: md5(password),
        });
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
}

//[GET] /user/info
module.exports.info = (req,res) =>{
    res.render("client/pages/user/info",{
        pagetitle:"Thông tin tài khoản",
    })
}