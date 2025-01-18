// app\api\user-verify\route.js
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to, subject, text } = await request.json();

    // Ensure the email credentials are stored in environment variables
    const emailUser = process.env.EMAIL_USER; // Your email address
    const emailPass = process.env.EMAIL_PASS; // Your app password (not your Gmail password)

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser, // Using the environment variable for the user
        pass: emailPass, // Using the environment variable for the app password
      },
    });

    // Email options
    const mailOptions = {
      from: emailUser, // Sender's email
      to, // Recipient's email
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500 }
    );
  }
}
