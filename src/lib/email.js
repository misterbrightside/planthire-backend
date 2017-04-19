import { createTransport } from 'nodemailer';

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

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

const mailOptions = ({ to, html }) => ({
  from: '"Plant Hire Ireland" <noreply@planthireireland.com>',
  to,
  subject: 'hello',
  text: 'test yasss',
  html
});

const sendMail = ({ to, html }) => {
  if (!validateEmail(to)) return null;
  const options = mailOptions({ to, html });
  transporter.sendMail(options, (error, info) => {
    if (error) console.log(error);
    else console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

export default sendMail;