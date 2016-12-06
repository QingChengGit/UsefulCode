/**
 * Created by liuxinxin on 2016/11/18.
 */
var Validator = require('../../formValid');

describe('formValid test', function() {
    var el = document.createElement('div'),
        str,
        valid,
        rs;

    str = '<div>' +
        '<input type="text" valid-name="user" validate="required,length:4;erMsg:请输入长度4位的用户名!" />' +
        '<input type="password" valid-name="pwd" validate="require,areaValid;erMsg:请输入合法的密码!" />' +
        '<input type="text" valid-name="code" validate="length:5,number;erMsg:验证码长度为5位数字!" />' +
        '<textarea valid-name="text" validate="areaValid;erMsg:内容必须包含AA字符!"></textarea>' +
        '<div valid-name="checkbox" validate="required;erMsg:请选择要吃的东西!">' +
            '<!-- 对于单项框、复选框这种组合类型的验证需要在其外面包裹一个容器，并对容器设置验证标识-->' +
            '<input type="checkbox" name="vehicle" value="Bike" />西红柿<br />' +
            '<input type="checkbox" name="vehicle" value="Car" />鸡蛋<br />' +
            '<input type="checkbox" name="vehicle" value="Airplane" />米饭<br />' +
        '</div>' +
        '</div>';
    el.innerHTML = str;
    document.body.appendChild(el);
    beforeEach(function() {
        valid = new Validator(el);
        el.querySelector('[valid-name="user"]').value = 'wertregf';
        el.querySelector('[valid-name="pwd"]').value = 'xxs';
        el.querySelector('[valid-name="code"]').value = 'ew2';
        el.querySelector('[valid-name="checkbox"]').setAttribute('valid-value', 'Car');
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
        rs = valid.verify(true);
        console.log(rs);
        expect(rs.isValid).not.toBeTruthy();
        expect(rs.erMsg[0][1]).toBe('请输入长度4位的用户名!');
        el.querySelector('[valid-name="code"]').value = '87865';
        el.querySelector('[valid-name="user"]').value = '878s';
        rs = valid.verify();
        expect(rs.isValid).toBeTruthy();
        expect(rs.erMsg.length).toBe(0);
    });

    it('addValidator test', function() {
        valid.addValidator({
            name: 'areaValid',
            method: function(val){
                return val.indexOf('AA') > -1;
            }
        });
        el.querySelector('[valid-name="text"]').value = '87AA8';
        el.querySelector('[valid-name="code"]').value = '46234';
        el.querySelector('[valid-name="pwd"]').value = 'weAAr';
        el.querySelector('[valid-name="user"]').value = 'wq8s';
        rs = valid.verify();
        expect(rs.isValid).toBeTruthy();
        el.querySelector('[valid-name="text"]').value = '87nttny8';
        rs = valid.verify();
        expect(rs.isValid).not.toBeTruthy();
        expect(rs.erMsg[0][1]).toBe('内容必须包含AA字符!');
    });
});