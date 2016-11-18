/**
 * Created by qingcheng on 16/11/18.
 */
function decorateBefore(fn, beforeFn) {
    "use strict";
    if(typeof fn !== 'function'){
        return function() {};
    }
    if(typeof beforeFn !== 'function'){
        return fn;
    }
    return function() {
        beforeFn.apply(this, arguments);
        return fn.apply(this, arguments);
    };
}

function decorateAfter(fn, afterFn) {
    "use strict";
    if(typeof fn !== 'function'){
        return function() {};
    }
    if(typeof beforeFn !== 'function'){
        return fn;
    }
    return function() {
        var rs;

        rs = fn.apply(this, arguments);
        afterFn.apply(this, arguments);

        return rs;
    };
}

function decorateBeforeAsync(fn, beforeFn) {
    "use strict";
    var then = fn && fn.then;

    if(then && typeof then === 'function'){
        //return fn.then(beforeFn);
    }
    return fn;
}

function decorateAfterAsync(fn, afterFn) {
    "use strict";

}