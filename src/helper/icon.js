const path = require('path');


const icons = {
    'css': '../../images/css.png',
    'sass': '../../images/sass.png',
    'txt': '../../images/TXT.png',
    'js': '../../images/js.png',
    'json': '../../images/json.png',
    'jsp': '../../images/jsp.png',
    'html': '../../images/html.png',
    'dir': '../../images/directory.png',
    'img': '../../images/tupian.png'
};

module.exports = function (file) {
    let ext = path.extname(file).split('.').pop().toLowerCase();
    if (!ext) {
        ext = 'dir';
    }
    if (ext.match(/\b(gif|jpg|png|svg|ico)\b/)) {
        ext = 'img';
    }
    return icons[ext] || icons['txt'];
};


