const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');

// 读取文件并筛选
function readFiles(dir, filterList, whitelistMode, ext) {
    return fs.readdirSync(dir)
        .filter(file => path.extname(file) === ext)
        .filter(file => {
            const filename = path.basename(file);
            if (whitelistMode) {
                return filterList.includes(filename); // 白名单检查
            } else {
                return !filterList.includes(filename); // 黑名单检查
            }
        })
        .map(file => path.join(dir, file))
        .map(filePath => fs.readFileSync(filePath, {
            encoding: 'utf-8'
        }));
}

// 合并和压缩逻辑
async function mergeAndMinify(srcDir, outputFile, selectedFiles, useWhitelist, ext) {
    const filesContent = readFiles(srcDir, selectedFiles, useWhitelist, ext);
    let mergedCode = filesContent.join('\n');

    let result;
    if (ext === '.js') {
        result = UglifyJS.minify(mergedCode);
        if (result.error) throw new Error(result.error);
    } else if (ext === '.css') {
        result = await new Promise((resolve, reject) => {
            new CleanCSS({}).minify(mergedCode, (error, minified) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(minified);
                }
            });
        });
    }

    // 创建输出目录（如果不存在）
    const distDir = path.dirname(outputFile);
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, {
            recursive: true
        });
    }

    fs.writeFileSync(outputFile, ext === '.js' ? result.code : result.styles);
    console.log(`Merged and minified ${ext === '.js' ? 'JS' : 'CSS'} bundle created at ${outputFile}`);
}

(async () => {
    try {
        const srcJsDir = path.resolve(__dirname, 'data/src');
        const jsOutputFile = path.resolve(__dirname, 'data/emulator-zh.min.js');

        const srcCssDir = path.resolve(__dirname, 'data/css/overlays');
        const cssOutputFile = path.resolve(__dirname, 'data/css/overlays.min.css');

        // JS合并和压缩
        const jsSelectedFiles = ['emulator.js']; // 白名单/黑名单列表
        const useJsWhitelist = false; // true使用白名单，反之使用黑名单
        await mergeAndMinify(srcJsDir, jsOutputFile, jsSelectedFiles, useJsWhitelist, '.js');

        // CSS合并和压缩
        const cssSelectedFiles = ['emulator.css']; // 白名单/黑名单列表
        const useCssWhitelist = false; // true使用白名单，反之使用黑名单
        await mergeAndMinify(srcCssDir, cssOutputFile, cssSelectedFiles, useCssWhitelist, '.css');

    } catch (err) {
        console.error('An error occurred:', err.message);
    }
})();



