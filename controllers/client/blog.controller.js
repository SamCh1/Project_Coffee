const Blog = require("../../models/blog.model")

//[GET] /blog
module.exports.index = async  (req, res) => {
    const blogs = await Blog.find({
        deleted: false,
        status: "active"
    })
    res.render("client_v2/pages/blog/index", {
        pageTitle: "trang blog",
        blogs: blogs
    })
}

//[GET] /blog/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findOne({
        _id: id,
        deleted: false,
        status: "active"
    })
    res.render("client_v2/pages/blog/detail", {
        pageTitle: "Trang chi tiết blog",
        blog: blog
    })
}

