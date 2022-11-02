const { generatePDF } = require('./generatePDF');
const fs = require("fs");

const attachPDFs = async function (templatesArray, data, response) {
    const result = await Promise.all(
        templatesArray.map(async (item) => {
            await generatePDF(item.templateName, data, response);
            attachmentContent = fs.readFileSync(`./Utils/temp/${item.templateName}.pdf`).toString("base64");
            return {
                content: attachmentContent,
                filename: `${data.person.firstName} ${data.person.lastName} - ${item.fileName} - Gebeya Plc`,
                type: "application/pdf",
                disposition: "attachment"
            };
        })
    );
    return result;
}

module.exports = {
    attachPDFs
}