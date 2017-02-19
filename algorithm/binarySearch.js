/**
 * Created by qingcheng on 16/12/10.
 */
/*
 二分查找非递归实现
 */
function binarySearch(arr, key) {
    "use strict";
    var middle,
        l = arr.length,
        leftLimit = 0,
        rightLimit = l - 1;

    shellSort(arr);
    while(leftLimit < rightLimit){
        middle = Math.floor((leftLimit + rightLimit)/2);
        if(key === arr[middle]){
            return middle;
        }
        if(key === arr[leftLimit]){
            return leftLimit;
        }
        if(key === arr[rightLimit]){
            return rightLimit;
        }else if(key < arr[middle]){
            rightLimit = middle - 1;
        }else{
            leftLimit = middle + 1;
        }
    }

    return null;
}

function shellSort(arr) {
    "use strict";
    var i,
        j,
        l = arr.length,
        outer,
        gap = getInitGap(l);

    while(gap >= 1){
        for(i = gap;i < l;i++){
            outer = arr[i];
            j = i;
            while(j >= 0 && arr[j - gap] > outer){
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = outer;
        }
        gap = getNextGap(gap);
    }
}

function getInitGap(l) {
    "use strict";
    var rs,
        count = 0;

    while((count = 3 * count + 1) < l){
        rs = count;
    }

    return rs;
}

function getNextGap(gap) {
    "use strict";

    return parseInt((gap - 1)/3, 10);
}
console.log(binarySearch([2,3,8,23,5,11,4,18,21,44,6,78,32,41,9], 8));