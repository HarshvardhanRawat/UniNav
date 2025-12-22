const expres = require('express');
const app = expres();
const path = require('path');
const ejsMate = require('ejs-mate');

const wrapAsync = require('./utilts/wrapAsync');

const port = 8080;

app.get('/', wrapAsync(async (req, res) => {
    res.render("index/index.ejs");
}));

app.get('/privacy', wrapAsync(async (req, res) => {
    res.render("index/privacy.ejs");
}));

app.get('/termsCondition', wrapAsync(async (req, res) => {
    res.render("index/termsCondition.ejs");
}));

app.engine('ejs', ejsMate);
app.use(expres.static(path.join(__dirname, 'public')));
app.use('/logo', expres.static(path.join(__dirname, 'logo')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
