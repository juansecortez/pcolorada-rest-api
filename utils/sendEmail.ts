import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  url: string,
  txt: string,
  anio: number
) => {
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
      attachments: [
        {
          filename: "start.png",
          path: "assets/start.png",
          cid: "start", //my mistake was putting "cid:logo@cid" here!
        },
      ],
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Inicio de grata ${anio}</h2>
      <p style="text-align:center">${txt}</p>
      <div style="display: flex; justify-content: center; align-items: center;">
      <a href="${url}"><img  width="150" src="cid:start"></a>
      </div>
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
