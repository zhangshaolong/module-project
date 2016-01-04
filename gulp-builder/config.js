module.exports = {
    buildPath: 'output',
    jsPath: 'asset',
    htmlPath: 'view',
    mainJsRule: /\s+data\-module\-path="((?:[^"]+\/)?main)"/g,
    lessRule: /\<link.*?href=["']([^>]+?)\.less["']/g
};