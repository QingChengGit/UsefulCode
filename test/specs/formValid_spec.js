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
        '<input type="password" name="pwd" validate="require" />' +
        '<input type="text" name="code" validate="length:5,number" />' +
        '<textarea name="text" validate="areaValid"></textarea>' +
        '</div>';
    el.innerHTML = str;
    beforeEach(function() {
        valid = new Validator(el);
        el.querySelector('[name="user"]').value = 'wertregf';
        el.querySelector('[name="pwd"]').value = 'xxs';
        el.querySelector('[name="code"]').value = 'ew2';
        el.querySelector('[name="user"]').value = 'sy';
    });

    it('init test', function() {
        valid = new Validator('wer');
        expect(valid.init).toThrow();
        valid = new Validator(el);
        expect(valid.init).not.toThrow();
    });

    it('verify test', function() {
        expect(valid.verify).not.toBeTruthy();
        el.querySelector('[name="code"]').value = '878';
        expect(valid.verify).toBeTruthy();

    });

    it('addValidator test', function() {
        valid.addValidator({
            name: 'areaValid',
            method: function(val){
                return val.indexOf('AA') > -1;
            }
        });
        el.querySelector('[name="text"]').value = '87AA8';
        el.querySelector('[name="code"]').value = '878';
        expect(valid.verify).toBeTruthy();
        el.querySelector('[name="text"]').value = '87nttny8';
        expect(valid.verify).not.toBeTruthy();
    });
});