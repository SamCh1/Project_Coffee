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