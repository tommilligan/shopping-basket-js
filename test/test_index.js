var chai = require("chai");
var subject = require("../src/index.js");

var expect = chai.expect;

describe("index.js", function(){
    describe("class", function(){
        it("should support arrow method syntax", function(){
            expect(new subject().bar()).to.equal("bar");
        });
    });
});
