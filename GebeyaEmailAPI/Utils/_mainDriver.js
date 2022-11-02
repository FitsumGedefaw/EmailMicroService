const { attachPDFs } = require('./attachPDFs');
const { sendEmail } = require('./sendEmail');
const fileSystem = require("fs-extra");


// checks if temp folder exists in the Utils directory
async function checkTempFolder() {
    if (!fileSystem.existsSync('./Utils/temp'))
        await fileSystem.mkdir('./Utils/temp');
}

const mainDriver = async (data, response) => {

    let sendGridAttachments = [];// holds PDFs' to be attached if there is any
    if (data.attachments && data.attachments.length > 0) {
        await checkTempFolder();
        sendGridAttachments = await attachPDFs(data.attachments, data.personalizations, response); // make pdf-files ready for email attachement
       
    }

    const msg = {
        from: data.from,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        templateId: data.templateId,
        dynamicTemplateData: data.personalizations,
        attachments: sendGridAttachments
    };

    // send mail
    await sendEmail(msg, response);

    if (sendGridAttachments)
        await fileSystem.emptyDir("./Utils/temp");  //clear the temp directory
}

module.exports = {
    mainDriver
};