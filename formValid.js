/**
 * Created by qingcheng on 16/11/18.
 */
var internalValidMap = {
    "required": function(val) {
        return val!= 0 && !val;
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
    this.validFns = null;
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
        validObj,
        arg,
        self = this;

    if(!el){
        throw Error('the element that is being verified can not be null!');
    }
    //compatible greater or equal than IE9
    children = toArray(el.querySelector('input'));
    children = children.concat(toArray(el.querySelector('textarea')));
    children.forEach(function(item, index, arr) {
        name = item.getAttribute('name');
        valids = item.getAttribute('validate');
        /*
            use validate property as the validate rules's sign。
            if there have multi validate rule,use "," as separator.
            for example:
            validate = "required,length:6,email"
         */
        if(name && valids){
            valids = valids.split(',');
            valids.length && (validObj = new Validator(name));
            validObj.validFns = [];
            valids.forEach(function(valid) {
                if(internalValidMap[valid]){
                    if(valid.split(':')[1]){
                        arg = validObj.args.push(valid.split(':')[1]);
                    }
                    validObj.validFns.push(function() {
                        internalValidMap[valid](item.value, arg);
                    });
                    self.validators.push(validObj);
                }
            });
        }
    });
};

MiddleValidator.prototype.addValidator = function addValidator(opt) {
    var methodName = opt.name,
        method = opt.method;
    if(typeof method !== 'function'){
        throw Error('the method of added validator must be function!');
    }
    internalValidMap[methodName] = method;
};

MiddleValidator.prototype.verify = function verify() {
    var rs = true,
        m = 0,
        n,
        fns;

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
            break;
        }
        m++;
    }
    return rs;
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