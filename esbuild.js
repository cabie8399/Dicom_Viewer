import { build } from 'esbuild';
import dotenv from 'dotenv';
import fs from 'fs';

const isProd = process.env.APP_ENV === 'production';
const isDev = process.env.APP_ENV === 'development';

const buildHtml = (input, output) => {
    fs.copyFileSync(input, output);

    const timesStamp = (new Date()).toLocaleString('sv', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).replace(/\s/, 'T');
    const srcHtml = fs.readFileSync(output).toString();
    const disHtml = srcHtml
        .replace('main.js', `main.js?${timesStamp}`)
        .replace('global.css', `global.css?${timesStamp}`);

    fs.writeFileSync(output, disHtml);
};

dotenv.config({
    path: `./env/.env.${process.env.APP_ENV}`,
});

build({
    entryPoints: ['./src/js/main.js'],
    outdir: './public/js',
    minify: isProd,
    bundle: true,
    format: 'esm',
    logLevel:'info',
    watch: isDev,
    define: {
        'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
        'env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
        'env.S3_URL': JSON.stringify(process.env.S3_URL),
    },
}).catch(() => process.exit(1));

buildHtml('./src/index.html', './public/index.html');

console.info(`build in ${process.env.APP_ENV}`);
