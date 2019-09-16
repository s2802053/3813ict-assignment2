module.exports = (req, res, next) => {
    // ensures the requester is authenticated
    if (!req.session.user){
        res.json({success: false, err: "User not authenticated", data: null});
    } else {
        next();
    }
};