module.exports = {
    buildPath: 'output',
    jsPath: 'asset',
    htmlPath: 'view',
    mainJsRule: /\s+data\-module\-path="((?:[^"]+\/)?main)"/g,
    lessRule: /\<link.*?href=["']([^>]+?)\.less["']/g,
    tplReg: /\{\{\s*\-\-\s*tpl\s*\:\s*([^\}\s]+)\s*\-\-\s*\}\}\s*([\s\S]+?)\{\{\s*\-\-\s*\/tpl\s*\-\-\s*\}\}/g,
    tplRule: /require\(["']tpl!([^"']+)["']\);?/g,
    includeReg: /\<\%\s*include\s*\(\s*(['"])(.*?)\1/g,
    baseUrlReg: /(baseUrl\s*:\s*["'](?:[^'"]+)?\/)src(["'],)/,
    cwd: process.cwd(),
    widgetsPath: '/src/component/widgets',
    cssPluginRule: /\s+require\('css\!([^\)]+?)'\);?/g,
    rootBase: '/omega-compute'
};