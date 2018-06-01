module.exports = (options, req) => ({
	html: {
        minimize: true,
        vendor: true
    },
    port: 6547,
    cleanOutDir: true
})
