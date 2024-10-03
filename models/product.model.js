const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    slug: { 
        type: String, 
        slug: "title",
        unique: true 
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    year: Number,
    origin: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        accountID: String,
        createdAt: Date,
    },
    deletedAt: Date,
    featured: String,
},{
    timestamps: true
});

const Product = mongoose.model("product", productSchema, "products");

module.exports = Product;