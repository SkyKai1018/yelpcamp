if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//region require
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const session = require('express-session');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
const dbUrl = process.env.DB_URL;

const MongoDBStore = require('connect-mongo')(session);

//endregion require

//region connect
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
//endregion connect

//region set & use
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisshouldbeabettersecret!',
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
    store,
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7),
    }
}

app.use(session(sessionConfig)) //shoudle be before passport.session()
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnbcxgi4w/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate() method from passport-local-mongoose

passport.serializeUser(User.serializeUser()); //serializeUser() method from passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); //deserializeUser() method from passport-local-mongoose

app.use((req, res, next) => {
    res.locals.currentUser = req.user; //req.user is from passport
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'coltttt@gmail.com', username: 'coltttt' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
//endregion set & use

//region RESTful

app.get('/', (req, res) => {
    res.render('home');
});

//endregion RESTful

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    res.status(statusCode).render('error', { err });
});

//region listen
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//endregion listen