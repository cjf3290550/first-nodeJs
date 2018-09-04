const http = require('http');
const path = require('path');
const chalk = require('chalk');
const config = require('./config/config');
const route = require('./helper/route');


const server = http.createServer((req,res) => {
    const filePath = path.join(config.root,req.url);
    route(req,res,filePath);
});

server.listen(config.port,config.hostname,() => {
    const addr = `http://${config.hostname}:${config.port}`;
    console.info(`server starts at${chalk.green(addr)}`);
});



