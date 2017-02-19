/**
 * Created by qingcheng on 17/2/12.
 */
function _clone(obj) {
    "use strict";
    var type,
        rs;

    type = typeof obj;

    switch(type) {
        case "string" :
            rs = obj + "";
            break;
        case "number" :
            rs = obj + 0;
            break;
        case "boolean" :
            rs = obj;
            break;
        case "undefined" :
            break;
        case "object" :
            if(Object.prototype.toString.call(obj) === "[object Array]"){
                rs = [];
                for(var i = 0, l = obj.length;i < l;i++){
                    rs.push(_clone(obj[i]));
                }
            }else if(Object.prototype.toString.call(obj) === "[object Null]"){
                rs = null;
            }else{
                rs = {};
                for(var p in obj){
                    if(obj.hasOwnProperty(p)){
                        rs[p] = _clone(obj[p]);
                    }
                }
            }
            break;
        default :
            rs = obj;
            break;
    }

    return rs;
}

//test
console.log(_clone(['a', 2, 3, , true]));
