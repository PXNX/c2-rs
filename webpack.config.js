const path = require('path');

module.exports = {
    entry: './main.ts',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'app.js',
    },
};