const Blog = require("../../models/blog.model")
const filterStatusHelper = require("../../helpers/filterState.helper");
const paginationHelper = require("../../helpers/pagination.helper")
const systemCongif = require("../../config/system")
const Account = require("../../models/account.model")

//[GET] /admin/blogs
module.exports.index= async (req, res) => {
    try {
        const filterState = filterStatusHelper(req.query);
        const find = {
            deleted: false
        };

        if(req.query.status){
            find.status = req.query.status;
        };

        //Search
        if(req.query.keyword){
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex;
            // reExp: "so khớp chuỗi , 'i' là so khớp không phân biệt hoa hay thường "
        }

        //Pagination
        const countProducts = await Blog.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts);
        //End Pagination

        //sort
        const sort={};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort["position"] = "desc";
        }
        //End sort

        const blogs = await Blog.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

        for (const blog of blogs){
            const account = await Account.findOne({
                _id: blog.createdBy.accountID
            });

            if(account){
                blog.createdBy.fullName = account.fullName;
            }else{
                delete blog.createdBy
            }
        }
        
        res.render("admin/pages/blogs/index", {
            pageTitle:"Danh sách bài viết",
            blogs: blogs,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
        })

    } catch (error) {
        console.log(error);
        res.redirect(`/${systemCongif.prefixAdmin}/blogs`);
    }
};


//[PATH] /admin/blogs/chang-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try{
        const status = req.params.status;
        const id = req.params.id;
    
        await Blog.updateOne({
            _id: id
        }, {
            status: status
        });
        req.flash('Success','Cập nhật trạng thái thành công!');
        res.redirect(`back`);
    } catch (error){
        req.flash('error','Cập nhật thất bại!');
        res.redirect(`back`);
    }
};

//[PATH] //admin/blogs/chang-status/:status/:id
module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        switch(type){
            case "active":
            case "inactive":    
                await Blog.updateMany({
                    _id: { $in: ids }
                }, {
                    status: type
                });
    
                req.flash('Success','Cập nhật trạng thái thành công!');
                break;
            case "delete-all":
                await Blog.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                req.flash('Success','Xóa bài viết thành công!');
                break;
            case "change-position":
               for (const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Blog.updateOne({
                    _id: id
                },{
                    position: position
                });
               }
                req.flash('Success','Thay đổi vị trí thành công!');
                break;
            default:
                break;
        }
        res.redirect("back");   
    } catch (error) {
        req.flash('error','Cập nhật thất bại!');
        res.redirect("back");
    }
};

//[DELETE] /admin/blogs/delete/id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        // xóa cứng
        // await Product.deleteOne({
        //     _id: id
        // });
        
        // xóa mềm
        await Blog.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        req.flash('Success','Xóa bài viết thành công!');
    } catch (error) {
        req.flash('Success','Xóa bài viết thất bại!');
        console.log(error);
    }finally{
        res.redirect("back");
    }
}

//[GET] //admin/blogs/create
module.exports.create = async(req, res) => {
    // const records = await ProductCategory.find({
    //     deleted: false,
    // });

    // const newRecords= createTreeHelper(records);
    res.render("admin/pages/blogs/create", {
        pageTitle: "thêm mới sản phẩm"
        // records: newRecords,
    });
}

//[POST] //admin/blogs/createPost
module.exports.createPost = async(req, res) => {   
    try {
        if(req.body.position == ""){
            const countProducts = await Blog.countDocuments();
            req.body.position = countProducts + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
    
        req.body.createdBy = {
            accountID: res.locals.user.id,
        };
    
        // if(req.file && req.file.filename){
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
        const blog = new Blog(req.body); //tạo mới 1 sản phẩm
        await blog.save(); // lưu vào database
        req.flash("Success","Thêm mới bài viết thành công");
        res.redirect(`/${systemCongif.prefixAdmin}/blogs`); 
    } catch (error) {
        console.log(error);
        req.flash("error","Thêm mới bài viết thất bại");
        res.redirect(`/${systemCongif.prefixAdmin}/blogs`); 
    }  
};

//[POST] //admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findOne({
            _id: id,
            deleted: false
        });
        
        res.render(`admin/pages/blogs/edit.pug`,{
           pageTitle: "chỉnh sửa sản phẩm",
           blog: blog,
        });
    } catch (error) {
        res.redirect(`/${systemCongif.prefixAdmin}/blogs`);
    }
};

//[PATCH] //admin/blogs/editPatch/
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position);
        
        if(req.file && req.file.filename){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        await Blog.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        req.flash("Success","Cập nhật bài viết thành công");
        res.redirect("back");    
    } catch (error) {
        console.log(error);
        req.flash("error","Cập nhật bài viết thất bại");
        res.redirect(`/${systemCongif.prefixAdmin}/blogs`);
    }
}