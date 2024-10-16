const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")
const ariticleRoutes = require("./article.route")
const blogRoutes = require("./blog.route")
const giftRoutes = require("./gift.route")
// const chatRoutes = require("./chat.route")

const caterogyMiddleware = require("../../middlewares/client/caterogy.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")
// const chatMiddleware = require("../../middlewares/client/chat.middleware")

module.exports = (app) => {
    app.use(caterogyMiddleware.caterogy); // để tất cả route đều phải chạy vào middleware này
    
    app.use(cartMiddleware.cart)

    app.use(userMiddleware.infoUser);

    app.use(settingMiddleware.settingGeneral);

    // app.use(chatMiddleware.ChatBot)

    app.use("/", homeRoutes);
    
    app.use("/products", productRoutes);

    app.use("/search",  searchRoutes)

    app.use("/cart", cartRoutes)

    app.use("/checkout", checkoutRoutes)

    app.use("/user", userRoutes)

    app.use("/article", ariticleRoutes)

    app.use("/blog", blogRoutes)

    app.use("/gift", giftRoutes)
    // app.use("/chat", chatRoutes)
}

