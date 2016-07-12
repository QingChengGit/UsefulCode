/**
 * Created by liuxinxin on 2016/7/12.
 */
//输入两个整数，输出这两整数之间的一个随机整数(可以包含输入的两个整数)
function getRandom(a, b) {
    var len = Math.abs(a, b),
        min = Math.min(a, b),
        rl = Math.round(Math.random() * len),
        ret = min + rl;

    return ret;
}