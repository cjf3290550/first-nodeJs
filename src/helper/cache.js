const {cache} = require('../config/config');

function refresh(stats, res) {
    const {maxAge, expires, cacheControl, lastModified, etag} = cache;

    if (expires) {
        res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).format('yyyy-MM-dd hh:mm:ss'));
    }

    if (cacheControl) {
        res.setHeader('Cache-Control', `Public max-age=${maxAge}`);
    }

    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.format('yyyy-MM-dd hh:mm:ss'));
    }

    if (etag) {
        res.setHeader('Etag', `${stats.size}-${stats.mtime.format('yyyy-MM-dd hh:mm:ss')}`);
    }
}


module.exports = function isFresh(stats, req, res) {
    refresh(stats, res);
    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
        return false;
    }

    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false;
    }

    if (etag && etag !== res.getHeader('Etag')) {
        return false;
    }

    return true;
};
