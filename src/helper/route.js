const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const template = require('art-template');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mimeType = require('./mime');
const iconType = require('./icon');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplpath = path.join(__dirname, '../template/route.tel.html');
const source = fs.readFileSync(tplpath, 'utf8');


module.exports = async function (req, res, filePath, config) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const contentType = mimeType(filePath);
            res.setHeader('Content-Type', contentType);
            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start, end});
            }
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                files: files.map(file => {
                    // console.info(chalk.yellow(iconType(file)))
                    return {
                        file: file,
                        icon: iconType(file)
                    };
                }),
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : ''
            };
            const tpl = template.render(source, data);
            res.end(tpl);
        }
    } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file`);
    }
};


