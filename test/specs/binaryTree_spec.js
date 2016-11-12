/**
 * Created by qingcheng on 16/11/12.
 */
var BinaryTree = require('../../binaryTree');

describe('BinaryTree algorithm test', function() {
    "use strict";
    var tree = new BinaryTree();
    beforeEach(function() {
        tree.init([
                {key: 2, val: 'we'},
                {key: 36, val: '俄访问'},
                {key:12, val: 'eqr'},
                {key:5, val: 'go'}
            ]
        );
    });

    it('init', function() {
        //spyOn跟踪函数调用;spayOn chain and.callThrough will delegate it to actual implementation!ßß
        spyOn(tree, 'addNode').and.callThrough();
        tree.init([{key: 66, val: 're'}]);
        expect(tree.addNode).toHaveBeenCalled();
        expect(tree.getNodeByKey(66).val).toBe('re');
    });

    it('preTravers', function() {
        expect(tree.preTravers()).toBe('2,36,12,5');
    });

    it('middleTravers', function() {
        expect(tree.middleTravers()).toBe('2,5,12,36');
    });

    it('postTravers', function() {
        expect(tree.postTravers()).toBe('5,12,36,2');
    });

    it('getNodeByKey', function() {
        expect(tree.getNodeByKey(12).val).toBe('eqr');
        expect(tree.getNodeByKey(5).key).toBe(5);
        expect(tree.getNodeByKey(18)).toBe(null);
        expect(tree.getNodeByKey()).toBe(null);
    });

    it('addNode', function() {
        tree.addNode(1, 'qingcheng');
        expect(tree.getNodeByKey(1).val).toBe('qingcheng');
        tree.addNode(22);
        expect(tree.getNodeByKey(22).val).not.toBeTruthy();
        tree.addNode(0, 'zero');
        expect(tree.getNodeByKey(0).val).toBe('zero');
        expect(function() {
            tree.addNode('', '34')
        }).toThrow();
    });

    it('deleteNode', function() {
        expect(tree.deleteNode(12).key).toBe(12);
        expect(tree.getNodeByKey(12)).toBe(null);
        expect(tree.deleteNode(34)).toBe(null);
    });
});