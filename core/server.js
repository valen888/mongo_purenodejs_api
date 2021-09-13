const http = require('http');
const util = require('util');
var PdfReader = require('pdfreader').PdfReader;
const PDFGenerator = require('pdfkit')
const fs = require('fs')
const path = require('path');
const user = require('../models/user');
const pdfile = require('../models/pdfile');
const settings = require('../settings');
const url = require('url');
const User = require('../models/user');
const process = require('process');

http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            if (req.url === "/users") {
                user.getAll()
                    .then(all_users => {
                        res.writeHead(200, { "ContentType": "application/json" });
                        res.write(JSON.stringify(all_users, null, 2));
                        res.end();
                    })
                    .catch(err => {
                        res.writeHead(200, { "ContentType": "text/plain" });
                        res.write(`Error while response: ${err}`);
                        res.end();
                    });
            } else if (req.url === "/test_pdf") {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = mm + '_' + dd + '_' + yyyy;

                let data = '';

                req.on('data', chunk => {
                    data += chunk;
                }).on('end', () => {
                    let new_pdf_name = ``;
                    let test = {
                        "firstname": "test",
                        "lastname": "Dev234",
                        "email": "danvas1437@gmail.com234",
                        "pnumber": "+380663666666234",
                        "location": "Ukraine,Sumy234",
                        "socials": "LinkedId: linkedid.com/danil234"
                    };
                    let user_data = test;

                    user.insert(new User(user_data.firstname, user_data.lastname,
                        user_data.email, user_data.pnumber, user_data.location, user_data.socials))
                        .then(nudata => {
                            let new_user_obj = {
                                firstname: nudata.firstname,
                                lastname: nudata.lastname,
                                email: nudata.email,
                                pnumber: nudata.pnumber,
                                location: nudata.location,
                                socials: nudata.socials
                            }
                            new_pdf_name = new_user_obj.firstname + '_' + new_user_obj.lastname + '_' + today;

                            let theOutput = new PDFGenerator;
                            theOutput.pipe(fs.createWriteStream(`./pdf_files/${new_pdf_name}.pdf`))
                            theOutput.text(JSON.stringify(new_user_obj, null, 2));
                            theOutput.end();
                            res.writeHead(200, {
                                'Content-Type': 'application/pdf',
                                'Content-disposition': `attachment; filename=${new_pdf_name}.pdf`
                            });
                            return pdfile.insert(new pdfile(new_pdf_name, today));
                        })
                        .then(pdf_data => {
                            let filePath = path.join(__dirname, `../pdf_files/${pdf_data.filename}.pdf`);
                            let readStream = fs.createReadStream(filePath);

                            readStream.on(`open`, function () {
                                readStream.pipe(res);
                            }).on(`finish`, function () {
                                readStream.close();
                                res.end();
                            })

                        })
                        .catch(err => {
                            res.writeHead(200, { "ContentType": "text/plain" });
                            res.write(`Error while response: ${err}`);
                            res.end();
                        });
                })
            }
            else if (url.parse(req.url, true).query.id) {
                const user_id = url.parse(req.url, true).query.id;
                user.getById(user_id)
                    .then(user_data => {
                        res.writeHead(200, { "ContentType": "application/json" });
                        res.write(JSON.stringify(user_data, null, 2));
                        res.end();
                    })
                    .catch(err => {
                        res.writeHead(200, { "ContentType": "text/plain" });
                        res.write(`Error while response: ${err}`);
                        res.end();
                    });
            }
            else {
                res.writeHead(404, { "ContentType": "application/text" });
                res.end();
            }
            break;
        case "POST":
            if (req.url === "/add_user") {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                });
                req.on('end', () => {

                    let user_data = JSON.parse(data);
                    user.insert(new User(user_data.firstname, user_data.lastname,
                        user_data.email, user_data.pnumber, user_data.location, user_data.socials))
                        .then(data => {
                            res.writeHead(200, {
                                'Content-Type': 'application/json',
                            });
                            res.write(JSON.stringify(data, null, 2));
                            res.end();
                        })
                        .catch(err => {
                            res.writeHead(200, { "ContentType": "text/plain" });
                            res.write(`Error while response: ${err}`);
                            res.end();
                        });

                })
            }
            else if (req.url === "/add_user_pdf") {

                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = mm + '_' + dd + '_' + yyyy;

                let data = '';

                req.on('data', chunk => {
                    data += chunk;
                }).on('end', () => {
                    let new_pdf_name = ``;
                    let user_data = JSON.parse(data);

                    user.insert(new User(user_data.firstname, user_data.lastname,
                        user_data.email, user_data.pnumber, user_data.location, user_data.socials))
                        .then(nudata => {
                            let new_user_obj = {
                                firstname: nudata.firstname,
                                lastname: nudata.lastname,
                                email: nudata.email,
                                pnumber: nudata.pnumber,
                                location: nudata.location,
                                socials: nudata.socials
                            }
                            new_pdf_name = new_user_obj.firstname + '_' + new_user_obj.lastname + '_' + today;

                            let theOutput = new PDFGenerator;
                            theOutput.pipe(fs.createWriteStream(`./pdf_files/${new_pdf_name}.pdf`))
                            theOutput.text(JSON.stringify(new_user_obj, null, 2));
                            theOutput.end();
                            res.writeHead(200, {
                                'Content-Type': 'application/pdf',
                                'Content-disposition': `attachment; filename=${new_pdf_name}.pdf`
                            });
                            return pdfile.insert(new pdfile(new_pdf_name, today));
                        })
                        .then(pdf_data => {
                            let filePath = path.join(__dirname, `../pdf_files/${pdf_data.filename}.pdf`);
                            let readStream = fs.createReadStream(filePath);

                            readStream.on(`open`, function () {
                                readStream.pipe(res);
                            });

                        })
                        .catch(err => {
                            res.writeHead(200, { "ContentType": "text/plain" });
                            res.write(`Error while response: ${err}`);
                            res.end();
                        });
                })

            }
            break;
    }
}).listen(settings.server_port, function () {
    console.log(`Started server at port ${settings.server_port}`);
})

