var chai = require('chai');
var subject = require('../src/index.js');

var expect = chai.expect;

describe('index.js', function(){
    describe('pass', function(){
        it('should be null', function(){
            expect(subject).to.be.null;
        });
    });
});
