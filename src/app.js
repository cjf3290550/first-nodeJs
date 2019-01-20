const http = require('http');
const path = require('path');
const chalk = require('chalk');
const config = require('./config/config');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Server {
    constructor(conf) {
        this.config = Object.assign({}, config, conf);
    }

    start() {
        const server = http.createServer((req, res) => {
            const filePath = path.join(this.config.root, req.url);
            route(req, res, filePath, this.config);
        });

        server.listen(this.config.port, this.config.hostname, () => {
            const addr = `http://${this.config.hostname}:${this.config.port}`;
            console.info(`server starts at ${chalk.green(addr)}`);
            openUrl(addr);
        });
    }
}


module.exports = Server;




