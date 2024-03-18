const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const LOGGER = require("../logger/logger")

const baseUrl = process.env.BASE_URL;

/*
This is used to verify emails upon account creation. Users are not created until
the user verifies their email
*/


const sendEmail = async(senderEmail, payload) => {
    // create email transporter
    //https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission
    // above link is required for sending mail through SMTP via outlook
    // the recommended way is to make a new acc under the org
    // and enable SMTP auth ONLY on that account
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.office365.com',
    //     secureConnection: false,
    //     port: 587,
    //     tls: {
    //     ciphers:'SSLv3'
    //     },
    //     auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });
    const transporter = nodemailer.createTransport({
        host: 'mail.buildingassure.com',
        port: 465,
        secure: true,
        // tls: {
        //     ciphers:'SSLv3'
        // },
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    // sign a token, putting the request body (all of the user input) into a header
    const token = jwt.sign({
            data: payload
        }, process.env.SECRET, { expiresIn: '10m' }  
    );    
      
    const mailConfigurations = {
      
        // It should be a string of sender/server email
        from: process.env.EMAIL,
      
        to: `${senderEmail}`,
      
        // Subject of Email
        subject: 'BasicPro Email Verification',
          
        // This would be the text of email body
        text: 
`Hi! 

You have recently signed up for a Building Alerts account.
Please follow the given link to verify your email
${baseUrl}/api/auth/verifyemail?id=${token} 

Thanks
Building Assure Team`
          
    };
    
    try {
        const info = await transporter.sendMail(mailConfigurations)
        console.log('Email Sent Successfully');
        console.log(info);
        LOGGER.debug("Email Sent Successfully");
        return ({
            status:"200",
            message: "Verification Email Sent Successfully"
        }); 

    } catch(err) {
        LOGGER.error("Error sending mail"); 
        return ({
            status:"500",
            message: err
        }); 
    }

}

//sendEmail("derekxu888@gmail.com", { username: "yay", password: "yes" });
module.exports = sendEmail;