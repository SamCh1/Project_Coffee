const express = require("express");
const dotenv = require("dotenv");
const routesAdmin = require("./routes/admin/index.route");
const routesClient = require("./routes/client/index.route");
const database = require("./config/database")
const systemCongif = require("./config/system")
const methodOverride = require('method-override')
const bodyParser = require(`body-parser`);
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require('path');
const moment = require("moment")
const http = require("http");
const { Server } = require("socket.io"); 

dotenv.config();// ưu tiên trên đầu
database.connect();

const app = express();
const port = process.env.PORT;

// SocketIo
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'))
// app.set("views","./views");  // Local
app.set("views",`${__dirname}/views`);
app.set("view engine", "pug");

// app.use(express.static("public")); Local
app.use(express.static(`${__dirname}/public`));


/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//flash
app.use(cookieParser('Randomkey'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//App local variables
app.locals.prefixAdmin = systemCongif.prefixAdmin;
app.locals.moment = moment;
//

//Routes Admin
routesAdmin(app);

// Routes Client
routesClient(app);

// Routes 404 Not Found
app.get("*", (req, res) => {
    res.render("client/pages/error/404",{
        pagetile: "404 Not Found",
    });
});



server.listen(port,() => {
    console.log(`Web listening on port ${port}`);
});

