import { createTransport } from 'nodemailer';

const smptConfig = {
  host: 'smtp1r.cp.blacknight.com',
  port: 25,
  secure: false,
  auth: {
      user: 'sender@beakon.ie',
      pass: 'eS6t4UcT=l'
  }
};

const transporter = createTransport(smptConfig);

const mailOptions = ({ to }) => ({
  from: '"Plant Hire Ireland" <noreply@planthireireland.com>',
  to: to,
  subject: 'hello',
  text: 'test yasss',
  html: '<b>test meeee!!!!!</b>'
});

const sendMail = ({ to }) => {
  const options = mailOptions({ to });
  transporter.sendMail(options, (error, info) => {
    if (error) console.log(error);
    else console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

export default sendMail;