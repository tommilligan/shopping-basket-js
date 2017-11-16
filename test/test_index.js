var chai = require('chai');
var shoppingBasket = require('../src/index.js');

var expect = chai.expect;

describe('index.js', function(){
    describe('pass', function(){
        describe('construction', function(){
            it('should provide default arguments', function(){
                expect(null).to.be.null;
            });
        });
    });
});
