module.exports = function (app) {
    app.get('/', index);
};

var index = function (req, res) {
    res.redirect('/example.html');
};