// require is a function provided by node.js to
// load modules and expose their exports 
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const rootRouter = require('./routes');
const db = require('./config/mongoose');
// body-parser is the Node.js body-parsing middleware. 
// It is responsible for parsing the incoming request 
// bodies in a middleware before you handle it. 
// Parsed info is available in req.body property
const bodyParser = require('body-parser');
// express-ejs-layouts package will help you to 
// create layouts in ejs
const expressLayouts = require('express-ejs-layouts');
// cookie-parser parses cookies in request object
const cookieParser = require('cookie-parser');
// to handle sessions
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
// used for flash messages
const flash = require('connect-flash');
const flashMiddleware = require('./middlewares/flash-middleware');

// create express application
const app = express();
require('./config/view-helpers')(app);
// port on which the app process is running
const PORT = 3000;

// setup the chat server using socket.io
const { createServer } = require('node:http');
const chatServer = createServer(app);
const chatSockets = require('./config/chat-sockets').chatSockets(chatServer);

chatServer.listen(5000, () => {
    console.log('Chat server running on port 5000');
})

// setup the logger
app.use(logger(env.morgan.mode, env.morgan.options));

// middleware to decode form data (x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// middleware to decode body
app.use(express.json());

// middleware to parse cookies
app.use(cookieParser());

// middleware to serve static files
app.use(express.static('./public/assets'))

// made the uploads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// use middleware to make layouts
app.use(expressLayouts);

// set some key values to extract styles and scripts
// from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set view engine and views folder
app.set('view engine', 'ejs');
app.set('views', './views');

// use express-session as middleware to create a session 
// in the browser with a cookie
app.use(session({
    name: 'codeial',
    // TODO - change secret in prod mode
    secret: env.session_cookie_secret,
    saveUninitialized: false,   // create session only when user is logged in
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 10)  // store for 1 minutes
    },
    store: MongoStore.create({
        client: db.getClient(),
        autoRemove: 'interval',
        // remove session data from db at an interval of 5 minutes
        autoRemoveInterval: 5  
    })
}));

// use passport session as middleware to initiate
// and maintain session
// req.session -> req.session.passport = {}
app.use(passport.initialize());
// req.session.passport -> req.session.passport.user = {}
app.use(passport.session());

// middleware to set user info in locals
app.use(passport.setAuthenticatedUser);

// middleware to store flash messages
app.use(flash());

// middleware to set flash messages in locals
app.use(flashMiddleware.setFlash);

// use express route
app.use('/', rootRouter);

// start the server and listen to incoming requests
app.listen(PORT, () => {
    console.log(`Server listening at port : ${PORT}`);
})