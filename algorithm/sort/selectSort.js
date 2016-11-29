/**
 * Created by qingcheng on 16/11/26.
 */
/*
            选择排序算法
        从未排序的数据中选择最小值(最大值)将其排在已排序好的数据的后面,重复此过程直到数据全部有序为止。
     步骤如下:
     1、找出从第i+1个到最后一个数据之中的最小数据,如果最小数据小于(大于)第i个数据将其与第i个数据交换位置。
     2、从剩下的N-i个数据中重复步骤1,直到排序结束。

        选择排序算法不稳。
 */
/*
    @desc 选择排序
    @param {Array} arr
    @param {Boolean} [isDESC]  是否降序排列,默认升序排列

    @return {Array} sorted array
 */
function selectSort(arr, isDESC){
    "use strict";
    var i = 0,
        j = i + 1,
        l = arr.length,
        mostIndex,
        mostVal,
        tmp;

    for(i;i < l;i += 1){
        mostIndex = i;
        mostVal = arr[i];
        for(j;j < l;j += 1){
            if(isDESC){
                if(arr[j] > mostVal){
                    mostVal = arr[j];
                    mostIndex = j;
                }
            }else{
                if(arr[j] < mostVal){
                    mostVal = arr[j];
                    mostIndex = j;
                }
            }
        }
        if(mostIndex !== i){
            //交换筛选出来的最值与arr[i]
            tmp = arr[i];
            arr[i] = mostVal;
            arr[mostIndex] = tmp;
        }
    }

    return arr;
}

module.exports = selectSort;