require("dotenv").config();
const sgMail = require('@sendgrid/mail');

//send dynamic email templates defined in sendgrid
const sendEmail = async function (msg, response) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const emailObject = {
    "from": msg.from,
    "to": msg.to,
    "dynamic_template_data": msg.dynamicTemplateData,
    "cc": msg.cc,
    "bcc": msg.bcc,
    "template_id": msg.templateId,
    "attachments": msg.attachments
  };

  sgMail
    .send(emailObject)
    .then((res) => {
      response.status(res[0].statusCode).send(`Email sent successfully for: ${msg.dynamicTemplateData.person.firstName}`);
    })
    .catch((error) => {
      response.status(error.code).send(error.response.body.errors[0].message);
    });

}

module.exports = {
  sendEmail
}