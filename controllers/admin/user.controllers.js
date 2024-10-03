const User = require("../../models/user.model")
const paginationHelper = require("../../helpers/pagination.helper")
const filterStatusHelper = require("../../helpers/filterState.helper")
const systemCongif = require("../../config/system")
module.exports.index = async (req,res) => {  
    
    try {
        const filterState = filterStatusHelper(req.query);
        const find = {
            deleted: false,
        };
    
        if(req.query.status){
            find.status = req.query.status;
        };

        /*Pagination */
        const countUser = await User.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countUser);


        const user = await User.find({
            deleted:false,
            status: "active"
        })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
        

        res.render("admin/pages/users/index.pug",{
            title:"Trang thông tin khách hàng",
            user: user,
            pagination: objectPagination,
            filterState: filterState
        });


    } catch (error) {
        console.log(error);
        res.redirect(`/${systemCongif.prefixAdmin}/products`);
    }
}