const mongoose = require("mongoose");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/verifyEmail")
const sendPasswordResetEmail = require("../utils/sendPasswordResetEmail")
const LOGGER = require("../logger/logger");
const Tenant = require("../models/TenantModel");
const crypto = require("crypto")
//const dotenv = require('dotenv').config(); 

const signup = async(req,res) => {
    // forbid the "admin" permission assignment
    if (req.body.permissions) {
        if (req.body.permissions == "admin") {
            return res.status(403).json("Forbidden assignment")
        }
    }
    try {
        // check if user exists
        const testUser = await User.findOne({
            username: req.body.username,
        });
        const testUserEmail = await User.findOne({ email: req.body.email })
        if (testUser || testUserEmail) { return res.status(400).json("Username or email already taken")}

        // hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // first create an unverified user
        const user = new User({
            ...req.body,
            //expiresAt: new Date(),
            password: hash
        })
        await user.save();
        LOGGER.debug(`Created unverified user: ${user.username}`)

        // send an email with the userId as the payload (userId is signed via JWT)
        const payload = {
            userId: user._id
        }
        LOGGER.debug("Sending email verification")
        const response = await sendEmail(req.body.email, payload);

        res.status(response.status).json({
            status: response.status,
            message: response.message
        });
        
    } catch(err) {
        LOGGER.error("Error sending email verification")
        res.status(500).json(err);
    }
}

const signin = async(req, res) => {
    try {
        const user = await User.findOne({ 
            $or: [{ username: req.body.username }, { email: req.body.email }] 
        });
        //console.log(user);
        if (!user) { return res.status(404).json("User not found"); }

        // check if email is verified
        if (!user.verified) {
            return res.status(403).json("Email not verified");
        }

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) { return res.status(400).json("Wrong credentials"); }

        // modify the sign body to add more keys to use for verification in other
        // areas of the app
        const token = jwt.sign(
            {id: user._id, permissions: user.permissions}, 
            process.env.SECRET,
            { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 25 } // 25 days
        );
        const {password, ...others} = user._doc;

        LOGGER.debug(`Signing in user: ${user.username} `)
        res.cookie("access_token", token, {
            httpOnly: true, // this should always be here
            sameSite:"none", // remove this if its causing issues
            secure: true, // and this,
            maxAge: 1000 * 60 * 60 * 24 * 25 // 25 days
        }).status(200).json(others);
    } catch(err) {
        LOGGER.error(`Error with login`)
        res.status(500).json(err);
    }
}

const signout = async(req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true, // this should always be here
            sameSite:"none", // remove this if its causing issues
            secure: true, // and this,
            maxAge: 1000 * 60 * 60 * 24 * 25 // 25 days
        }).status(200).json("Logged out")
    } catch(err) {
        res.status(500).json(err);
    }
}

// ---------------------------- EMAIL VERIFICATION ----------------------------
const verifyEmail = async(req, res) => {
    try {
        // first get the token when the email link is clicked on
        const token = req.query.id;
    
        // verify the token
        jwt.verify(token, process.env.SECRET, async(err, response) => {
            if (err) {
                res.status(403).json({ message:"Email verification failed", error: err });
            }
            else {

                // find the user and update the verified status as well as remove expiration
                const user = await User.findByIdAndUpdate(response.data.userId, {
                    $set: { verified: true },
                    $unset: { "expiresAt": 1 }
                }, { new: true });

                LOGGER.debug(`Verified user: ${user.username}`)
                res.status(200).json({
                    "message": "User successfully verified",
                    "user": user
                });
            }
        }).catch(err => { 
            LOGGER.error(`Error verifying user`);
            return res.status(501).json({
                "message": "Error verifying user. It's possible that the token is expired or the user waited too long before verifying",
                "error": err
        })})
    } catch(err) {
        LOGGER.error(`Error verifying user`);
        res.status(500).json(err);
    }
}


const resendVerificationLink = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.query.email });
        if (!user) { return res.status(404).json("User not found"); }
        else if (user.verified) { return res.status(403).json("Email already verified"); }
        else {
            const payload = {
                userId: user._id
            }
            const response = await sendEmail(user.email, payload);

            res.status(response.status).json({
                status: response.status,
                message: response.message
            });
        }
    } catch(err) {
        res.status(500).json(err);
    }
}
// ---------------------------- END EMAIL VERIFICATION ----------------------------

const inviteUser = async(req, res) => {
    // try {
    //     const { token } = req.params;
    //     const response = await jwt.verify(token, process.env.SECRET);

    //     /*
    //     Example response:
    //     {
    //         senderEmail: 'testuser@gmail.com',
    //         senderName: 'tester',
    //         tenantId: '649cd6ff98c1b782f47fcf93',
    //         tenantName: 'An Office Business'
    //     }
    //     */

    //     // if we already have a logged in user
    //     if (req.user) {
    //         const updatedTenant = await Tenant.findByIdAndUpdate(response.data.tenantId,{
    //             $addToSet: { users: req.user.id }
    //         }, { new: true });

    //         res.status(200).json({
    //             "status": 200,
    //             "message": "User added to tenant"
    //         })
    //     } else {

    //     }


    // } catch(err) {
    //     res.status(500).json(err);
    // }
}

// ---------------------------- PASSWORD RESET ----------------------------
/**
 * password resets work by simply finding the user and sending a jwt to the found user's email
 * the jwt contains the user's id and email. The user then clicks on the link and is redirected
 * to the password reset page. The user then enters a new password and the verified jwt includes
 * info about the user to reset. The user should make a request to another endpoint upon password submit. 
 * The jwt is verified and the user's password is updated
 */
const forgotPassword = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) { return res.status(404).json("User not found"); }

        // create unique code
        const payload = {
            userId: user._id,
            email: user.email
        };


        const response = await sendPasswordResetEmail(user.email, payload);

        res.status(response.status).json({
            status: response.status,
            message: response.message
        });
    } catch(err) {
        res.status(500).json(err);
    }
}
const redirectToReset = async(req, res) => {
    try {
        const token = req.query.id;
        // returns the unverified token, this should be sent with the password request, and the token verified there
        // res.status(200).json({
        //     token: token
        // })
        res.render("resetPassword.html", { token: token });
    } catch(err) {
        res.status(500).json(err);
    }
}
const resetPassword = async(req, res) => {
    try {
        const token = req.body.token;
        const payload = (await jwt.verify(token, process.env.SECRET)).data;
        
        // find the user
        const user = await User.findById(payload.userId);
        if (!user) { return res.status(404).json("User not found"); }
        if (!req.body.password) { return res.status(400).json("Password is required"); }

        // update the user's password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        user.password = hash;
        await user.save();

        res.status(200).json("User password updated");
    } catch(err) {
        res.status(500).json(err);
    }
}
// ---------------------------- END PASSWORD RESET ----------------------------


// ---------------------------- EXPORTS ----------------------------
module.exports = {
    signup,
    signin,
    verifyEmail,
    inviteUser,
    signout,
    resendVerificationLink,
    forgotPassword,
    redirectToReset,
    resetPassword
}