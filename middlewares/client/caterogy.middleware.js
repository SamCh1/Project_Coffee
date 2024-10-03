const ProductCaterogy = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/create-tree.helper")

module.exports.caterogy = async (req, res, next) => {
    const caterogyPRoducts = await ProductCaterogy.find({
        status: "active",
        deleted: false,
    });
    
    const newCaterogyProducts = createTreeHelper(caterogyPRoducts);
    res.locals.layoutCaterogyProducts = newCaterogyProducts;
    
    next();
}