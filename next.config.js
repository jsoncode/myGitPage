const withLess = require("next-with-less");

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}
const lessConfig = {
    lessLoaderOptions: {
        lessOptions: {
            modifyVars: {
                // "primary-color": "#9900FF",
                // "border-radius-base": "2px",
            },
        },
    },
}

module.exports = withLess({
    ...nextConfig,
    ...lessConfig,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })
        return config
    }
})