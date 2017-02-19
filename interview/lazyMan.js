/**
 * Created by qingcheng on 17/2/12.
 */
function _lazyMan(name) {
    "use strict";
    var self = this,
        fn;

    this.taskQueue = [];
    fn = function() {
        console.log('This is lazyMan ' + name);
        self.runNext();
    };
    this.taskQueue.push(fn);
    setTimeout(function() {
        self.runNext();
    }, 0);
}

_lazyMan.prototype.sleep = function sleep(t) {
    "use strict";
    var self = this,
        fn;

    fn = function() {
        setTimeout(function() {
            console.log('weak up after ' + t);
            self.runNext();
        }, t);
    };
    this.taskQueue.push(fn);

    return this;
};

_lazyMan.prototype.eat = function eat(name) {
    "use strict";
    var self = this,
        fn;

    fn = function() {
        console.log('Eat ' + name + '~');
        self.runNext();
    };
    this.taskQueue.push(fn);

    return this;
};

_lazyMan.prototype.sleepFirst = function sleepFirst(t) {
    "use strict";
    var self = this,
        fn,
        task;

    fn = function() {
        setTimeout(function() {
            console.log('weak up after ' + t);
            self.runNext();
        }, t);
    };
    task = this.taskQueue.pop();
    this.taskQueue.push(fn, task);

    return this;
};

_lazyMan.prototype.runNext = function runNext() {
    "use strict";
    var task;

    task = this.taskQueue.shift();
    task && task();
};

function LazyMan(name) {
    "use strict";
    return new _lazyMan(name);
}

LazyMan('欣欣').eat('米饭').sleep(2000).eat('apple').eat('rice').sleepFirst(1000);