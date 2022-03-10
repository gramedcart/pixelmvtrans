const pack = require('electron-is-packaged').isPackaged;

exports.isPackaged = () => {
    return pack
}
