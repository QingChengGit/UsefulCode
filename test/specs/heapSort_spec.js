/**
 * Created by qingcheng on 16/11/27.
 */
var sort = require('../../algorithm/sort/heapSort');

describe('heap sort test', function() {
    "use strict";
    var a,
        asc = '1,3,5,6,6,8,9,12,20,22,23,33',
        desc = '33,23,22,20,12,9,8,6,6,5,3,1';

    beforeEach(function() {
        a = [3,6,1,20,23,12,6,8,5,33,22,9];
    });
    it('ASC sort test', function() {
        expect(sort(a).join()).toBe(asc);
    });
    it('DESC sort test', function() {
        expect(sort(a, true).join()).toBe(desc);
    });
});