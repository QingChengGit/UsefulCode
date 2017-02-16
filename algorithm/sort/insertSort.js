/**
 * Created by qingcheng on 16/11/26.
 */
/*
                插入排序算法
      可以按如下思路理解插入排序算法:
        上体育课时排队做体操,学生到操场时是杂乱一堆站在一起的,此时老师开始对所有学生按高矮排好体操队列。
      首选老师挑选第一个学生将讲放到体操方队中,因为此时体操方队没有别的学生所以第一个同学就是直接排在第
      一个,然后老师把第二个同学放入体操方队中跟前面一个同学比较,如果方队中前面那个同学个子高于目前这个同
      学则把这个同学插入方队第一个的位置,把高个子同学往后挪一个位置。然后老师继续挑选第三个同学到体操方队
      中,此时首选把第三个同学跟方队中最后一个同学(也就是最高的同学)比较高矮,如果这个同学比方队中最高的同
      学高则直接将所挑选的第三个同学插入到方队的第三个位置,否则继续将所挑选的第三个同学跟方队中第一个同学
      比较高矮如果矮于方队中第一个同学则把所挑选的第三个同学插入到方队第一的位置,原先方队中的同学依次往后
      挪一个位置。对剩下的同学重复上述步骤,直到结束。

      插入排序算法是稳定第排序算法.
 */

function insertSort(arr, isDESC){
    "use strict";
    var i = 0,
        j,
        l = arr.length,
        tmp,
        rs = [];
    if(!l){
        return rs;
    }
    //将第一个元素直接插入到结果数组(rs)中
    rs.push(arr[i]);
    i++;
    for(i;i < l;i += 1){
        j = i;
        rs.push(arr[i]);
        //逆向遍历rs找到合适的插入位置。查找合适插入点可以优化,比如使用二分查找法等待!
        while(j--){
            if(isDESC){
                if(rs[j] > rs[j-1]){
                    _swap(rs, j, j-1);
                }else{
                    break;
                }
            }else{
                if(rs[j] < rs[j-1]){
                    _swap(rs, j, j-1);
                }else{
                    break;
                }
            }
        }
    }
    return rs;
}

function _insertSort(arr) {
    var rs = [],
        l = arr.length,
        i = 0,
        j;

    for(i;i < l;i++){
        rs.push(arr[i]);
        for(j = rs.length - 2;j >= 0;j--){
            if(rs[j] > arr[i]){
                //不需要交互两数据只需要把当前比待插入的数据往后挪就行
                rs[j + 1] = rs[j];
                if(j === 0){
                    rs[j] = arr[i];
                }
            }else{
                rs[j + 1] = arr[i];
                break;
            }
        }
    }

    return rs;
}

/*
    交换数组中第i个位置和第j个位置的数据
 */
function _swap(arr, i, j){
    "use strict";
    var tmp;

    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
//test
console.log(_insertSort([2, 8, 4, 12, 1, 3, 5, 22, 9, 26, 18, 7, 11, 13, 25, 6, 19, 88, 39]));

module.exports = insertSort;