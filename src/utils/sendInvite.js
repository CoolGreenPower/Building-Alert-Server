const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const LOGGER = require("../logger/logger")

const baseUrl = process.env.BASE_URL;

/*
This is not currently being used nor does it work. It used to serve as a way to 
send an invite to a building via link but we instead just left the invite system
to be contained within the app. Meaning a user must create an account first then
receive an invite to a building.
*/

// sends token via email, expires in default(30 minutes).
const sendEmail = async(senderEmail, data, expiresIn=30) => {
    // create email transporter
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
        // });
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });
    
    // sign a token, putting the request body (all of the user input) into a header
    const token = jwt.sign({
            data: data
        }, process.env.SECRET, { expiresIn: `${expiresIn}m` }  
    );    
      
    const mailConfigurations = {
      
        // It should be a string of sender/server email
        from: process.env.EMAIL,
      
        to: `${senderEmail}`,
      
        // Subject of Email
        subject: 'BasicPro Invitation',
          
        // This would be the text of email body
        text: 
`Hi! 

You have been invited by ${data.senderName} (${data.senderEmail}) to join BasicPro. 
Please click on the link below to join BasicPro.
${baseUrl}/api/auth/invite/${token} 

Thanks`
          
    };
    
    try {
        const info = await transporter.sendMail(mailConfigurations)
        console.log('Email Sent Successfully');
        console.log(info);
        LOGGER.debug("Email Sent Successfully");
        return ({
            status:"200",
            message: "Email Sent Successfully"
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