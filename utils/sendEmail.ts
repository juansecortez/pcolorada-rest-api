import nodemailer from "nodemailer";

export const sendEmail = async (to: string, url: string, txt: string) => {
  try {
    const SENDER_EMAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
    const SMTP_HOST = `${process.env.SMTP_HOST}`;
    var transport = nodemailer.createTransport({
      host: `${SMTP_HOST}`,
      port: 25,
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: SENDER_EMAIL,
      to: to,
      subject: txt,
      html: ` <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Grata iniciada</h2>
    <p>
    Prueba grata
    </p>
  
  <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
  
  <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  
  <div>${url}</div>
  </div>
  `,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error: any) {
    console.log(error);
    return;
  }
};
