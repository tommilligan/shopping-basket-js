// @flow
import { describe, it, beforeEach } from "mocha";
import chai from "chai";
import { Basket, Shop } from "../src/index.js";

import type { Item } from "../src/index.js";

let expect = chai.expect;

let milk: Item = {
    id: "6318dbff-8e44-48df-97a5-c3430d2c8861",
    price: 1.49,
    title: "Milk (2L)",
};
let bread: Item = {
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
        it("should store an array of items during construction", function() {
            shop = new Shop([milk, bread]);
            let actual = shop.get(bread.id);
            expect(actual).to.equal(bread);
        });
        it("should store and retrieve item", function() {
            shop.add(milk);
            let actual = shop.get(milk.id);
            expect(actual).to.equal(milk);
        });
    });
    describe("working shop", function() {
        let shop = new Shop();
        beforeEach(function() {
            shop = new Shop([milk, bread]);
        });
        it("should not overwrite items by default", function() {
            expect(function() {
                shop.add(milk);
            }).to.throw();
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
            }).to.throw();
        });
        describe("basket", function() {
            let basket = new Basket(shop);
            beforeEach(function() {
                basket = new Basket(shop);
            });
            describe("items by id", function() {
                it("add item from shop", function() {
                    basket.add(milk.id);
                    let quantity = basket.getQuantity(milk.id);
                    expect(quantity).to.equal(1);
                });
                it("errors on duplicate addition", function() {
                    basket.add(milk.id);
                    expect(function () {
                        basket.add(milk.id);
                    }).to.throw();
                });
                it("add and remove item from shop", function() {
                    basket.add(milk.id);
                    basket.remove(milk.id);
                    expect(basket.contains(milk.id)).to.be.false;
                });
                it("should throw error for remoing non-existant item", function() {
                    expect(function () {
                        basket.remove(milk.id);
                    }).to.throw();
                });
            });
            describe("items via shop", function() {
                it("getting a whole item", function() {
                    let item = basket.get(milk.id);
                    expect(item.title).to.equal("Milk (2L)");
                });
            });
            describe("quantities", function() {
                it("increment if exists", function() {
                    basket.add(milk.id);
                    basket.increment(milk.id);
                    basket.increment(milk.id);
                    let quantity = basket.getQuantity(milk.id);
                    expect(quantity).to.equal(3);
                });
                it("no increment if not exists", function() {
                    expect(function() {
                        basket.increment(milk.id);
                    }).to.throw();
                });
                it("set arbitrary positive quantity", function() {
                    basket.setQuantity(milk.id, 42);
                    let quantity = basket.getQuantity(milk.id);
                    expect(quantity).to.equal(42);
                });
                it("cannot set quantity < 1", function() {
                    expect(function() {
                        basket.setQuantity(milk.id, 0);
                    }).to.throw();
                    expect(function() {
                        basket.setQuantity(milk.id, -42);
                    }).to.throw();
                });
                it("decrement if greater than 1", function() {
                    basket.setQuantity(milk.id, 42);
                    basket.decrement(milk.id);
                    let quantity = basket.getQuantity(milk.id);
                    expect(quantity).to.equal(41);
                });
                it("not decrement if quantity is 1", function() {
                    basket.add(milk.id);
                    expect(function() {
                        basket.decrement(milk.id);
                    }).to.throw();
                });
            });
            describe("should calculate properties", function() {
                beforeEach(function() {
                    basket.empty();
                    basket.setQuantity(milk.id, 2);
                    basket.add(bread.id);
                });
                it("total", function() {
                    expect(basket.total()).to.equal(3.88);
                });
                it("shallow array representation", function() {
                    let expected = [
                        [milk.id, 2],
                        [bread.id, 1]                        
                    ];
                    expect(basket.toShallowArray()).to.deep.equal(expected);
                });
                it("deep array representation", function() {
                    //basket.remove(bread.id);
                    let expected = [
                        [milk, 2],
                        [bread, 1]                        
                    ];
                    expect(basket.toDeepArray()).to.deep.equal(expected);
                });
                it("string representation", function() {
                    let expected = "2x Milk (2L)\n1x Bread (Wholemeal)";
                    expect(basket.toString()).to.equal(expected);
                });
            });
        });
    });
});
