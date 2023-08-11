/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        'swagger-ui-dist',
        'swagger-client',
        'react-syntax-highlighter'
    ]
}

module.exports = nextConfig