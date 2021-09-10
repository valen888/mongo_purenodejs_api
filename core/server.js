const http = require('http');
const user = require('../models/user');
const pdfile = require('../models/pdfile');
const settings = require('../settings');

http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            if (req.url === "/"){
                res.end();
            }
            else if(req.url === "/users"){
                user.getAll()
                .then(data =>{
                    res.writeHead(200, {"ContentType":"application/json"});
                    //res.write(JSON.stringify(data));
                    res.write(JSON.stringify({"hello":"helolo"}));

                    res.end();
                })
            }
            break;
        case "POST":
            break;

    }
}).listen(settings.server_port,function(){
    console.log(`Started server at port ${settings.server_port}` );
})
