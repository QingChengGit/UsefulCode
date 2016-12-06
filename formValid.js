/**
 * Created by qingcheng on 16/11/18.
 */
var internalValidMap = {
    "required": function(val) {
        return !!(val == 0 || val);
    },
    "number": function(val) {
        var value = val == 'null' ? '' : val;
        return !isNaN(value);
    },
    "length": function(val, l) {
        val  = val + '';
        return val.length == l;
    }
};

function Validator(name) {
    this.name = name;
    this.validTypes = '';
    this.validFns = null;
    this.erMsg = '';
}

function MiddleValidator(el) {
    this.el = el;
    this.validators = [];
}

MiddleValidator.prototype.init = function init() {
    var el = typeof this.el === 'string' ? document.querySelector(this.el) : this.el,
        children,
        name,
        valids,
        validType,
        validVal,
        validObj,
        fn,
        validFlag = 'valid-name',
        self = this;

    if(!el){
        throw Error('the element that is being verified can not be null!');
    }
    //compatible greater or equal than IE9
    children = toArray(el.querySelectorAll('[' + validFlag + ']'));
    children.forEach(function(item, index, arr) {
        name = item.getAttribute(validFlag);
        valids = item.getAttribute('validate');
        /*
            use validate property as the validate rules's sign。
            if there have multi validate rule,use "," as separator.
            for example:
            validate = "required,length:6,email"
         */
        if(name && valids!= null){
            validObj = new Validator(name);
            valids = valids.split(';');
            if(valids[1]){
                validObj.erMsg = valids[1].split(':')[1];
            }
            valids = valids[0].split(',');
            validObj.validFns = [];
            validObj.validTypes = [];
            valids.forEach(function(valid) {
                validObj.validTypes.push(valid);
                valid = valid.split(':');
                validType = valid[0];
                validVal = valid[1];
                if(fn = internalValidMap[validType]){
                    (function(f, e, val) {
                        "use strict";
                        validObj.validFns.push(function() {
                            var data = e.value || e.getAttribute('valid-value');
                            return f(data, val);
                        });
                    })(fn, item, validVal);
                }
            });
            fn = null;
            validObj.validTypes = validObj.validTypes.join();
            self.validators.push(validObj);
        }
    });
};

MiddleValidator.prototype.addValidator = function addValidator(opt) {
    var methodName = opt.name,
        method = opt.method,
        self = this,
        reg,
        matchRs,
        tag;
    if(typeof method !== 'function'){
        throw Error('the method of added validator must be function!');
    }
    internalValidMap[methodName] = method;
    reg = new RegExp(',?(' + methodName + '(:\w+)?)');
    self.validators.forEach(function(item) {
        "use strict";
        matchRs = item.validTypes.match(reg);
        if(matchRs && matchRs[1]){
            tag = self.el.querySelector('[valid-name="'+ item.name + '"]');
            (function(e, arg) {
                item.validFns.push(function() {
                    var data = e.value || e.getAttribute('valid-value');
                    return method(data, arg);
                });
            })(tag, matchRs[2]);
            tag = null;
            matchRs = null;
        }
    });
};

MiddleValidator.prototype.verify = function verify(showAllMsg) {
    var rs = true,
        m = 0,
        n,
        fns,
        erMsgs = [];

    while(m < this.validators.length){
        n = 0;
        fns = this.validators[m].validFns;
        while(n < fns.length){
            rs = fns[n]();
            if(!rs){
                break;
            }
            n++;
        }
        if(!rs){
            erMsgs.push([this.validators[m].name, this.validators[m].erMsg]);
            if(!showAllMsg){
                break;
            }
        }
        //if showAllMsg is true and previous validator vaildFns result is false
        //at this case if current validator validFns.length is 0,then it's erMsg
        //will bell push erMsgs arry!so we need do this.
        rs = true;
        m++;
    }
    erMsgs.length && (rs = false);
    if(rs){
        //清理内存,测试时需去掉
        this.validators = [];
    }
    return {
        isValid: rs,
        erMsg: erMsgs
    };
};

function toArray(likeArr) {
    var rs = [],
        i = 0,
        l;

    if(!likeArr){
        return rs;
    }
    l = likeArr.length;
    for(i;i < l;i += 1){
        rs.push(likeArr[i]);
    }

    return rs;
}

module.exports = MiddleValidator;