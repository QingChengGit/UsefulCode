/**
 * Created by qingcheng on 16/11/24.
 */
/*
        LRU(least recently used:最近最少使用)缓存算法

    传统意义的LRU算法是为每一个Cache对象设置一个计数器，每次Cache命中则给计数器+1，
 而Cache用完，需要淘汰旧内容，放置新内容时，就查看所有的计数器，并将最少使用的内容替换掉。
    它的弊端很明显，如果Cache的数量少，问题不会很大， 但是如果Cache的空间过大，达到10W或者
 100W以上，一旦需要淘汰，则需要遍历所有计算器，其性能与资源消耗是巨大的。效率也就非常的慢了。
    该算法的实现是基于双向链表的思路来实现LRC算法,以解决当缓存容量达到限制需要删除最少使用
 的数据时传统LRU算法需要遍历所有项的性能问题。

 本文参考如下文章思路:
 http://flychao88.iteye.com/blog/1977653
*/
var p = LRUCache.prototype;

function LRUCache(limit) {
    "use strict";
    this.limit = limit;
    //缓存的头部、尾部指针
    this.head = this.tail = null;
    //当前缓存中的数据个数
    this.size = 0;
    //创建一个空对象,并且此对象无原型对象,跟对象字面两不同。对象字面量有个__proto__属性指向Object的原型
    this._keyMap = Object.create(null);
}

p.push = function push(key, val) {
    "use strict";
    //链表其实是先进先出的队列
    var entry,
        removed;

    if(key != 0 && !key){
        throw Error('key must not be null if you want push data in cache!');
    }
    if(this.size === this.limit){
        //当缓存中的数据达到缓存最大容量时需要删除缓存中最少使用的数据,以便给新数据挪出空间
        removed = this.shift();
    }
    entry = this.get(key, true);
    if(!entry){
        entry = {
            key: key
        };
        this._keyMap[key] = entry;
        if(this.tail){
            this.tail.newer = entry;
            entry.older = this.tail;
        }else{
            this.head = entry;
        }
        this.tail = entry;
        this.size++;
    }
    entry.value = val;

    return removed;
};

/*
        从缓存中获取数据,如果命中缓存则将命中的缓存数据放到链表的尾部(即队列的尾巴,
    因为队列是先进先出,所以队列头部head的数据是最少被使用过的数据).
 */
p.get = function get(key, isGetEntry) {
    "use strict";
    var entry;

    entry = this._keyMap[key];
    if(!entry){
        return;
    }
    if(entry !== this.tail){
        if(entry.older){
            entry.newer.older = entry.older;
            entry.older.newer = entry.newer;
        }else{
            //说明head位置的数据被命中了
            entry.newer.older = null;
            this.head = entry.newer;
        }
        entry.older = this.tail;
        entry.newer = null;
    }
    this.tail.newer = entry;
    this.tail = entry;

    return isGetEntry ? entry : entry.value;
};

/*
    手动清理cache最少被访问的数据
 */
p.shift = function shift() {
    "use strict";
    var entry;

    if(this.size){
        entry = this.head;
        //head指针前移
        this.head = this.head.newer;
        entry.newer = entry.older = null;
        this._keyMap[entry.key] = null;
        this.size--;
    }

    return entry;
};

module.exports = LRUCache;