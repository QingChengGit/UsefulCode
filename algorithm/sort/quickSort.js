/**
 * Created by qingcheng on 16/12/10.
 */
/*
            快速排序算法

     核心思想:
        1、对待排序数据选择中间的元素作为"基准",
        2、将所有小于基准元素的元素放到左边,所有大于基准元素的元素放到右边
        3、分别对左边、右边的数据重复进行第一、二步骤,直到子集左、右元素长度为1,此时数据就已经排好序
 */
var quickSort = function quick(arr) {
    "use strict";
    var i,
        l = arr.length >> 0,
        middle,
        leftRs = [],
        rightRs = [];

    if(l <= 1){
        return arr;
    }
    middle = Math.floor(l / 2);
    middle = arr.splice(middle, 1);
    for(i = 0;i < l - 1;i += 1){
        if(arr[i] < middle){
            leftRs.push(arr[i]);
        }else{
            rightRs.push(arr[i]);
        }
    }

    return quick(leftRs).concat(middle, quick(rightRs));
};