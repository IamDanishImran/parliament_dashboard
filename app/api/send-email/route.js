// app\api\send-email\route.js
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Parse the incoming request body
    const { recipient, subject, body } = await request.json();

    // Create a transporter for sending emails via Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'imran24022004@gmail.com', // Your Gmail email
        pass: 'xtcn wsqt wvan eczg', // The 16-character app password you generated
      },
    });

    // Email options
    const mailOptions = {
      from: 'imran24022004@gmail.com', // Sender's email
      to: recipient, // Recipient's email
      subject: subject, // Email subject
      html: body, // HTML body (used for rich content)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(JSON.stringify({ message: 'Email sent successfully', info }), {
      status: 200,
    });
  } catch (error) {
    // Handle any errors that occur
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Error sending email', error }), {
      status: 500,
    });
  }
}
