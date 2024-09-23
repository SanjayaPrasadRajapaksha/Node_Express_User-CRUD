import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const userMail = {
    sendEmail: async (from, name) => {
        const text = "Welcome...!";
        const userMail = "sanjayaprasad823@gmail.com";

        const mailOptions = {
            from: from,
            to: userMail,
            subject: `New Message from ${name}`,
            text: `You got a new message from ${name} 
               via email ${from}
               ${text}`
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: userMail,
                pass: "cbey flhj knko enfe", // Ideally, use process.env for this.
            },
        });

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}


export default userMail;
