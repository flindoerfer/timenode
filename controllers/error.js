
exports.error = function(err, req, res, next) {
    res.status(500);
    res.render('error', {title: 'Sorry, something went wrong!', hideNav: true, errorStack: err.stack});
}
