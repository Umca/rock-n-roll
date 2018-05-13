const CompressionPlugin = require("compression-webpack-plugin")

module.exports = (options, req) => ({
	html: {
		title: 'Tablature editor',
        description: 'Awesome tablature editor',
        minimize: true,
        vendor: true
    },
    webpack(config) {
        config.plugins.push(new CompressionPlugin({
            cache: true,
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            minRatio: 0.8
        }))
    	return config
    }
})
