module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://skrispyb.github.io' || 'http://localhost:3000/',
  },
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
}
