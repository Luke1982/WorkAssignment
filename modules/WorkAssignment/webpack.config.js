const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    resolve: {
        extensions: [
            '.js',
            '.jsx'
        ]
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
                        presets: ["@babel/preset-react"],
                        plugins: [
                            "@babel/plugin-proposal-object-rest-spread",
                            "babel-plugin-transform-class-properties",
                            "babel-plugin-transform-export-extensions"
                        ]
                    }
				  }
            },
        ]
    },
    mode: 'development', // Either 'development' or 'production'
    performance: {
        hints: false // Surpress warnings on for instance exceeding the 244kB limit
    }
};