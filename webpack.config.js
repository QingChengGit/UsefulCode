/**
 * Created by Administrator on 2015/9/19.
 */
var path = require('path'),
    dist = path.resolve('../UsefulCode/dist'),
    _dirname = path.resolve('../UsefulCode/test/specs');

module.exports = {
    entry: {
        bundle: _dirname + "/binaryTree_spec.js"
    },
    output: {
        path: dist,
        /*
            要使用webpack的热替换功能则必须正确设置publicPath(其值跟path的最后
            一级目录名相同就行),执行webpack命令编译之后，启动webpack-dev-server
             --inline --hot命令启动webpack-dev-server服务器并自动检测热替换，实
             现自动刷新功能
         */
        publicPath: "/dist/",
        //[name]将会被替换为entry对象的键名，在多实体打包时使用很方便。
        filename: "[name].js"
        //filename: "[hash].bundle.js"
    },
    resolveLoader: {
        root: path.resolve('node_modules')
    }
    //devtool:'source-map'//设置此属性，使用webpack打包时会自动生成输出文件对应的resource map文件
};