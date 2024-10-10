const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const roleRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const systemCongif = require("../../config/system")
const authRoutes = require("./auth.route")
const settingRoutes = require("./setting.route")
const myAccountRoutes = require("./my-account.route")
const userRoutes = require("./user.route")
const blogRoutes = require("./blog.route")
const roomsChatRoutes = require("./rooms-chat.route")
const chatRoutes = require("./chat.route")

const authMiddleware = require("../../middlewares/admin/auth.middleware")


module.exports = (app) => {
    const PATH_ADMIN = `/${systemCongif.prefixAdmin}`;
    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);
    app.use(`${PATH_ADMIN}/products`, authMiddleware.requireAuth,productRoutes);
    app.use(`${PATH_ADMIN}/products-category`, authMiddleware.requireAuth, productCategoryRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountRoutes);
    app.use(`${PATH_ADMIN}/auth`, authRoutes);
    app.use(`${PATH_ADMIN}/my-account`, authMiddleware.requireAuth, myAccountRoutes);
    app.use(`${PATH_ADMIN}/settings`, authMiddleware.requireAuth, settingRoutes );
    app.use(`${PATH_ADMIN}/users`, authMiddleware.requireAuth, userRoutes);
    app.use(`${PATH_ADMIN}/blogs`, authMiddleware.requireAuth, blogRoutes);
    app.use(`${PATH_ADMIN}/rooms-chat`,authMiddleware.requireAuth, roomsChatRoutes);
    app.use(`${PATH_ADMIN}/chat`, authMiddleware.requireAuth, chatRoutes);
}