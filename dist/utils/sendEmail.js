"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Función para envio de correos hacia un servidor de SMTP
 */
const sendEmail = (to, url, txt, title) => __awaiter(void 0, void 0, void 0, function* () {
    const SENDER_EMAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
    const SMTP_HOST = `${process.env.SMTP_HOST}`;
    var transport = nodemailer_1.default.createTransport({
        host: `${SMTP_HOST}`,
        port: 2525,
        tls: {
            rejectUnauthorized: false,
        },
    });
    const mailOptions = {
        from: SENDER_EMAIL,
        to: to,
        subject: txt,
        cc: `cgutierrez@pcolorada.com`,
        html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">${title}</h2>
      <p style="text-align:center">${txt}</p>
      <div style="display: flex; justify-content: center; align-items: center;">
      <a href="${url}" >INICIAR</a>
      </div>
      </div>
      `,
    };
    yield transport.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
