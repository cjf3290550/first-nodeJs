const {exec} = require('child_process');

module.exports = url => {
    if (process.platform === 'darwin') {
        exec(`open ${url}`);
    } else if (process.platform === 'win32') {
        exec(`start ${url}`);
    }
};
