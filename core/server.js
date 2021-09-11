const http = require('http');
const PDFGenerator = require('pdfkit')
const fs = require('fs')
const path = require('path');
const user = require('../models/user');
const pdfile = require('../models/pdfile');
const settings = require('../settings');
const url = require('url');
const User = require('../models/user');

http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            if (req.url === "/users") {
                user.getAll()
                    .then(all_users => {
                        res.writeHead(200, { "ContentType": "application/json" });
                        console.log(all_users);
                        res.write(JSON.stringify(all_users));
                        res.end();
                    })
                    .catch();
            } else if (url.parse(req.url, true).query.id) {
                console.log(url.parse(req.url, true).query.id);
                const user_id = url.parse(req.url, true).query.id;
                user.getById(user_id)
                    .then(user_data => {
                        res.writeHead(200, { "ContentType": "application/json" });
                        res.write(JSON.stringify(user_data));
                        res.end();
                    })
                    .catch();
            } else {
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
                            console.log(data);
                        })
                    res.writeHead(200, { "ContentType": "application/json" });

                    res.end();
                })
            }
            else if (req.url === "/add_user_pdf") {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                });

                req.on('end', () => {

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
                            //////

                            var today = new Date();
                            var dd = String(today.getDate()).padStart(2, '0');
                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                            var yyyy = today.getFullYear();
                            today = mm + '_' + dd + '_' + yyyy;
                            //////
                            console.log(`got date ${today}`);

                            let new_pdf_name = new_user_obj.firstname + '_' + new_user_obj.lastname + '_' + today;

                            console.log(`got new pdf name ${new_pdf_name}`);


                            setTimeout(() => {
                                let theOutput = new PDFGenerator;
                                theOutput.pipe(fs.createWriteStream(`./pdf_files/${new_pdf_name}.pdf`))
                                theOutput.text(JSON.stringify(new_user_obj));
                                theOutput.end();
                                console.log(`created file`);
                            }, 3500);


                            //////
                            return pdfile.insert(new pdfile(new_pdf_name, today));
                        })
                        .then(pdf_data => {
                            console.log(`inserted pdf`);

                            setTimeout(() => {
                                var filePath = path.join(__dirname, `../pdf_files/${pdf_data.filename}.pdf`);
                                var stat = fs.statSync(filePath);

                                res.writeHead(200, {
                                    'Content-Type': 'application/pdf',
                                    'Content-Length': stat.size
                                });
                                var readStream = fs.createReadStream(filePath);
                                readStream.pipe(res);
                            }, 3500);

                            console.log(`pdf out`);
                        })

                    })
                    
                    res.end();
            }
            break;

    }
}).listen(settings.server_port, function () {
    console.log(`Started server at port ${settings.server_port}`);
})

