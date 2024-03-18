
/**
 * This is kind of a reduntant function for authentication but it could be used to 
 * ensure admin actions stay with admins.
 */
const requireAdmin = (req, res, next) => {
    if (req.user.permissions === "admin") {
        next();
    } else {
        return res.status(403).send("You are not authorized to perform this action.");
    }
    
}

module.exports = requireAdmin;
