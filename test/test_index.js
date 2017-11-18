// @flow
import { describe, it, beforeEach } from "mocha";
import chai from "chai";
import { Basket, Shop } from "../src/index.js";

let expect = chai.expect;

let milk = {
    id: "6318dbff-8e44-48df-97a5-c3430d2c8861",
    price: 1.49,
    title: "Milk (2L)",
};
let bread = {
    id: "667fa050-2249-462b-b3db-f75bc51ec7f3",
    price: 0.90,
    title: "Bread (Wholemeal)",
};

describe("index.js", function() {
    describe("shop construction", function() {
        let shop = new Shop();
        beforeEach(function() {
            shop = new Shop();
        });
        it("should store and retrieve item", function() {
            shop.add(milk);
            let actual = shop.get(milk.id);
            expect(actual).to.equal(milk);
        });
        it("should store an array of items during construction", function() {
            shop = new Shop([milk, bread]);
            let actual = shop.get(bread.id);
            expect(actual).to.equal(bread);
        });
    });
    describe("working shop", function() {
        let shop = new Shop();
        beforeEach(function() {
            shop = new Shop([milk]);
        });
        it("should not overwrite items by default", function() {
            expect(function() {
                shop.add(milk);
            }).to.throw;
        });
        it("should overwrite items if requested", function() {
            let milkOrganic = {
                price: 2.49,
                ...milk
            };
            shop.add(milkOrganic, true);
            expect(shop.get(milk.id).price).to.equal(milkOrganic.price);            
        });
        it("should throw error for non-existant items", function() {
            expect(function() {
                shop.get("spam");
            }).to.throw;
        });
        describe("basket", function() {
            let basket = new Basket(shop);
            beforeEach(function() {
                basket = new Basket(shop);
            });
            it("add item from shop", function() {
                basket.add(milk.id);
                let quantity = basket.quantity(milk.id);
                expect(quantity).to.equal(1);
            });
            it("add and remove item from shop", function() {
                basket.add(milk.id);
                basket.remove(milk.id);
                expect(basket.contains(milk.id)).to.be.false;
            });
            it("should throw error for remoing non-existant item", function() {
                expect(function () {
                    basket.remove(milk.id);
                }).to.throw;
            });
            it("should calculate total correctly", function() {
                basket.add(milk.id);
                shop.add(bread);
                basket.add(bread.id);
                expect(basket.total()).to.equal(2.39);
            });
        });
    });
});
