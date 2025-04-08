import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, date ,time ,packagee } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    await transporter.sendMail({
      from: `"SMV Super Speciality Hospital" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Appointment Confirmation for ${name} – ${date} at ${time}`,
      html: ` <body style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2c3e50;">Appointment Confirmed </h2>
    
    <p style="color: #000000;">Dear <strong>${name}</strong>,</p>

    <p style="color: #000000;">Thank you for choosing <strong>SMV Super Speciality Hospital</strong>. Your appointment has been successfully booked. Here are the details:</p>

    <table style="border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #000000;">📅 Date</td>
        <td style="padding: 8px;">${date}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;color: #000000;">⏰ Time</td>
        <td style="padding: 8px;">${time}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;color: #000000;">📝 Selected Package</td>
        <td style="padding: 8px;">${packagee}</td>
      </tr>
    </table>

    <p style="color: #000000;">📍 Please arrive 15 minutes before your scheduled time for a smooth check-in process.</p>

    <p style="color: #000000;">If you have any questions or need to reschedule, feel free to reply to this email or contact our helpdesk.</p>

    <p style="color: #000000;">Regards,<br/>
    <strong>SMV Super Speciality Hospital</strong><br/>
    Customer Care Team</p>
    <img src='https://smvhospitals.com/assets/logofull-e4WDzVn8.png' alt="Verified" width="50" style="display:block; margin-top: 20px;" />


    <hr/>
    <small style="color: #000000;">This is an automated message. Please do not reply directly to this email.</small>
  </body>`
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
