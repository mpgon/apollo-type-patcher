/* eslint @typescript-eslint/no-var-requires: 0 */

var path = require("path");

module.exports = {
    entry: "./src/index",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.bundle.js",
        library: "apollo-type-patcher",
        libraryTarget: "commonjs2",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },
};
