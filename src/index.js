// @flow

class BasketError extends Error {}
class ShopError extends Error {}

type Id = string;

interface Item {
    id: Id;
    price: number;
    title: string;
}

class Shop {
    items: Map<Id, Item>;

    constructor(items?: Array<Item>) {
        this.items = new Map();
        if (items) {
            items.forEach(item => {
                this.add(item);
            });
        }
    }

    add = (item: Item, overwrite: boolean = false): void => {
        let id = item.id;
        if (!this.contains(id) || overwrite) {
            this.items.set(id, item);
        } else {
            throw new ShopError(`Item '${id}' is already in shop`);
        }
    }

    contains = (id: Id): boolean => {
        return this.items.has(id);
    }

    get = (id: Id): Item => {
        let item = this.items.get(id);
        if (item) {
            return item;
        } else {
            throw new ShopError(`Item '${id}' is not in shop`);
        }
    }
}

class Basket {
    shop: Shop;
    contents: Map<Id, number>

    constructor(shop: Shop) {
        this.shop = shop;
        this.contents = new Map();
    }

    add = (id: Id): void => {
        if (!this.contains(id)) {
            this.contents.set(id, 1);
        } else {
            throw new BasketError(`Item '${id}' already in basket`);
        }
    }

    adjustQuantity = (id: Id, adjustment: number): void => {
        let quantity = this.getQuantity(id);
        this.setQuantity(id, quantity + adjustment);
    }

    contains = (id: Id): boolean => {
        return this.contents.has(id);
    }

    decrement = (id: Id): void => {
        this.adjustQuantity(id, -1);
    }

    get = (id: Id): Item => {
        return this.shop.get(id);
    }

    getQuantity = (id: Id): number => {
        let quantity = this.contents.get(id);
        if (quantity) {
            return quantity;
        } else {
            throw new BasketError(`Item '${id}' is not in basket`);
        }
    }

    increment = (id: Id): void => {
        this.adjustQuantity(id, +1);
    }

    remove = (id: Id): void => {
        if (this.contains(id)) {
            this.contents.delete(id);
        } else {
            throw new BasketError(`Item '${id}' is not in basket`);
        }
    }

    setQuantity = (id: Id, quantity: number): void => {
        this.contents.set(id, quantity);        
    }

    total = (): number => {
        let accumulator: number = 0.0;
        for (let [id, quantity] of this.contents) {
            accumulator += (quantity * this.shop.get(id).price);
        }
        return accumulator;
    }
}

module.exports = {
    Basket,
    Shop,
    BasketError,
    ShopError
};
