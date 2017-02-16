/**
 * Created by liuxinxin on 2017/2/16.
 */
function shellSort(arr) {
    var i,
        j,
        temp,
        l = arr.length,
        gap = getMaxGap(l);

    while(gap > 0){
        console.log('gap:' + gap);
        for(i = gap;i < l;i++){
            j = i;
            temp = arr[i];
            while(j >= 0 && arr[j - gap] > temp){
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
        console.log(arr);
        gap = getNextGap(gap);
    }
    return arr;
}

function getMaxGap(len) {
    var gap = 0,
        t;

    while((t = 3 * gap + 1) < len){
        //希尔排序间隔计算公式
        gap = t;
    }

    return gap;
}

function getNextGap(gap) {
    //希尔排序间隔计算公式的逆推
    return parseInt((gap - 1) / 3, 10);
}

//test
console.log(shellSort([2, 8, 4, 12, 1, 3, 5, 22, 9, 26, 18, 7, 11, 13, 25, 6, 19, 88, 39]));




