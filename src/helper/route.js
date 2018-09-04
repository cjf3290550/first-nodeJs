const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const chalk = require('chalk');
const template = require('art-template');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/config');


const tplpath = path.join(__dirname,'../template/route.tel.html');
const source = fs.readFileSync(tplpath,'utf8');

module.exports = async function (req,res,filePath) {
    try {
        const stats = await stat(filePath);
        if(stats.isFile()){
            res.statusCode = 200;
            res.setHeader('Content-Type','text/plain');
            fs.createReadStream(filePath).pipe(res);
        }else if(stats.isDirectory()){
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(config.root,filePath);
            const data = {
                content:files,
                title:path.basename(filePath),
                dir:dir?`/${dir}`:''
            };
            const tpl = template.render(source,data);
            res.end(tpl);
        }
    }catch (err){
        console.error(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.end(`${filePath} is not a directory or file`);
    }
};


