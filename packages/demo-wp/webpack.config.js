const path = require('path');
const WebpackWatchPlugin = require('webpack-watch-files-plugin').default;

module.exports = {
    plugins: [
        new WebpackWatchPlugin({
            files: [
                './src/**/*.js',
                '!./src/*.test.js',
                '../d3-plot-lib/dist/**/*'
            ]
        })
    ],
    entry: './src/index.tsx', // Specify the entry point of your compiled TypeScript code
    output: {
        filename: 'index.js', // Name your output file
        path: path.resolve(__dirname, 'public'),
    },
    mode: "development",
    devServer: {
        port: "9500",
        static: ["./public"],
        open: true,
        hot: true,
        liveReload: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: path.resolve(__dirname, "tsconfig.json"),
                },
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true } },
                ],
                exclude: /node_modules/
            }
        ]
    }
};