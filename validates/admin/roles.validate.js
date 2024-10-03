module.exports.createPost  = (req,res,next)=>{
    if(!req.body.title){
        req.flash("Error","tiêu đề không được để trống");
        res.redirect("back");
    }

    if(req.body.title.length < 5){
        req.flash("error", "Tiêu đề phải chứa ít nhất 5 ký tự!");
        res.redirect("back");
        return;
    }
    next();
}