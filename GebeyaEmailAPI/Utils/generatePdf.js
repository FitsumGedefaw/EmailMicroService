const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const puppeteer = require('puppeteer');

//handlebars template To HTML
const compileTemplate = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'PDF-Templates', `${templateName}.hbs`);
    const template = await fs.readFile(filePath, 'utf8');
    return hbs.compile(template)(data);
};

// dynamic pdf generation
const generatePDF = async function (templateName, data, response) {

    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
        const page = await browser.newPage();
        const content = await compileTemplate(templateName, data);
        await page.setContent(content);
        await page.pdf({
            path: `./Utils/temp/${templateName}.pdf`,
            format: 'A4',
            printBackground: true
        });
        await browser.close();
    }
    catch (error) {
        return response.status(400).send(JSON.stringify(error.message));
    }

};

module.exports = {
    generatePDF
}