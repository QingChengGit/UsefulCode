/**
 * Created by liuxinxin on 2016/11/18.
 */
var Validator = require('../../formValid');

describe('formValid test', function() {
    var el = document.createElement('div'),
        str,
        valid;

    str = '<div>' +
        '<input type="text" name="user" validate="required,length:4" />' +
        '<input type="password" name="pwd" validate="require,areaValid" />' +
        '<input type="text" name="code" validate="length:5,number" />' +
        '<textarea name="text" validate="areaValid"></textarea>' +
        '</div>';
    el.innerHTML = str;
    document.body.appendChild(el);
    beforeEach(function() {
        valid = new Validator(el);
        el.querySelector('[name="user"]').value = 'wertregf';
        el.querySelector('[name="pwd"]').value = 'xxs';
        el.querySelector('[name="code"]').value = 'ew2';
        valid.init();
    });

    it('init test', function() {
        valid = new Validator('wer');
        expect(function() {
            valid.init();
        }).toThrow();
        valid = new Validator(el);
        expect(function() {
            valid.init();
        }).not.toThrow();
    });

    it('verify test', function() {
        expect(valid.verify()).not.toBeTruthy();
        el.querySelector('[name="code"]').value = '87865';
        el.querySelector('[name="user"]').value = '878s';
        expect(valid.verify()).toBeTruthy();

    });

    it('addValidator test', function() {
        valid.addValidator({
            name: 'areaValid',
            method: function(val){
                console.log(val);
                return val.indexOf('AA') > -1;
            }
        });
        el.querySelector('[name="text"]').value = '87AA8';
        el.querySelector('[name="code"]').value = '46234';
        el.querySelector('[name="pwd"]').value = 'weAAr';
        el.querySelector('[name="user"]').value = 'wq8s';
        expect(valid.verify()).toBeTruthy();
        el.querySelector('[name="text"]').value = '87nttny8';
        expect(valid.verify()).not.toBeTruthy();
    });
});