/**
 * Created by qingcheng on 16/11/27.
 */
/*
                堆排序算法

      1、什么是堆:
      这里的堆(二叉堆),指得不是堆栈的那个堆,而是一种数据结构。堆可以视为一棵完全的二叉树,完全二叉树的一个“优秀”的性质是,除了
      最底层之外,每一层都是满的,这使得堆可以利用数组来表示,每一个结点对应数组中的一个元素.

      2、什么是完全二叉树:
      若设二叉树的深度为h，除第 h 层外，其它各层 (1～h-1) 的结点数都达到最大个数，第 h 层所有的结点都连续集中在最左边，这就
      是完全二叉树。

      3、最大堆和最小堆:
      堆中每个父节点的元素值都大于等于其孩子结点（如果存在）,这样的堆就是一个最大堆因此,最大堆中的最大元素值出现在根结点(堆顶)。

      4、堆节点与数组索引关系:
      对于给定的某个结点的下标i，可以很容易的计算出这个结点的父结点、孩子结点的下标，而且计算公式很漂亮很简约:
      Parent(i) = i/2;(i从1开始计算)
      Left(i) = 2 * i;
      Right(i) = 2 * i + 1;

      参考文章:
    http://www.cnblogs.com/Anker/archive/2013/01/23/2873422.html
 */

function heapSort(arr, isDESC){
    "use strict";
    var i,
        j ,
        l = arr.length,
        tmp;

    //从下标为arr.length/2的节点处开始构调整堆,其实也是初始化建堆的过程
    for(i = Math.floor(l/2 -1);i >= 0;i -= 1){
        _adjustHeap(arr, i, l, !isDESC);
    }
    /*
            对堆进行排序,排序的思路是从最后一个元素开始将其与根节点(即arr[0])交换,然后
        对0~arr.length-1之间对元素进行堆调整,依次执行此操作直到第二个元素执行完成为止就
        完成了排序过程。
     */
    for(j = l-1;j > 0;j -= 1){
        tmp = arr[j];
        arr[j] = arr[0];
        arr[0] = tmp;
        _adjustHeap(arr, 0, j, !isDESC);
    }

    return arr;
}

/*
    @desc 在下标为index~limit之间调整下标为index的节点,使其满足最大堆或者最小堆
 */
function _adjustHeap(arr, index, limit, isMax){
    "use strict";
    var left,
        right,
        most,
        tmp;

    //因为JS中数组下标是从0开始的
    left = index * 2 + 1;
    right = index * 2 + 2;
    most = index;
    if(left < limit){
       if(isMax && arr[most] < arr[left]){
           most = left;
       }
       if(!isMax && arr[most] > arr[left]){
           most = left;
       }
    }
    if(right < limit){
        if(isMax && arr[most] < arr[right]){
            most = right;
        }
        if(!isMax && arr[most] > arr[right]){
            most = right;
        }
    }
    if(index !== most){
        tmp = arr[most];
        arr[most] = arr[index];
        arr[index] = tmp;
        //递归调整堆使其满足最大(小)堆的性质
        _adjustHeap(arr, most, limit, isMax);
    }
}

module.exports = heapSort;