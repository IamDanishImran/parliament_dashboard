// app/api/user-verify/route.js
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Parse the JSON payload from the request
    const { to, subject, text } = await request.json();

    // Ensure the environment variables are loaded correctly
    const emailUser = process.env.EMAIL_USER; // Your Gmail address
    const emailPass = process.env.EMAIL_PASS; // Your app password

    // If either emailUser or emailPass is missing, throw an error
    if (!emailUser || !emailPass) {
      console.error("EMAIL_USER or EMAIL_PASS environment variables are missing.");
      return new Response(
        JSON.stringify({
          error: "Email configuration is missing. Check environment variables.",
        }),
        { status: 500 }
      );
    }

    // Configure the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Verify the transporter connection
    await transporter.verify();
    console.log("Transporter verified successfully");

    // Define the email options
    const mailOptions = {
      from: emailUser, // Sender's email address
      to,              // Recipient's email address
      subject,         // Email subject
      text,            // Email body text
    };

    // Send the email using nodemailer
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error sending email:", error);

    // Return a detailed error response
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to send email",
        stack: error.stack || "No stack trace available",
      }),
      { status: 500 }
    );
  }
}
