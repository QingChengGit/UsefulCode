/*
    将一个数组中的元素复制到另一个数组的另一种简洁方法
 */
var s = ['a', 'b', 'c'],
    b = [2, 3, 5];

/*
    巧妙使用apply方法，避免了遍历b并把b中元素push到s中去,
    把数组b作为s.push函数的参数集！
 */
s.push.apply(s, b);
console.log(s);//输出[ 'a', 'b', 'c', 2, 3, 5 ]