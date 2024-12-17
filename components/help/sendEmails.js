// // 
// import nodemailer from 'nodemailer';

// // Create a transporter object using your email provider's SMTP server
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'imran24022004@gmail.com',
//     pass: 'parliament_dashboard_alor_gajah',
//   },
// });

// export const sendEmail = async (to, subject, body) => {
//   const mailOptions = {
//     from: 'imran24022004@gmail.com',
//     to: to,
//     subject: subject,
//     text: body,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };
