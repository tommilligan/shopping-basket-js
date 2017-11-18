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

    // Item management
    add = (id: Id): void => {
        if (!this.contains(id)) {
            this.contents.set(id, 1);
        } else {
            throw new BasketError(`Item '${id}' already in basket`);
        }
    }

    contains = (id: Id): boolean => {
        return this.contents.has(id);
    }

    empty = (): void => {
        this.contents.clear();
    }

    get = (id: Id): Item => {
        return this.shop.get(id);
    }

    remove = (id: Id): void => {
        if (this.contains(id)) {
            this.contents.delete(id);
        } else {
            throw new BasketError(`Item '${id}' is not in basket`);
        }
    }

    // Quantity management
    adjustQuantity = (id: Id, adjustment: number): void => {
        let quantity = this.getQuantity(id);
        this.setQuantity(id, quantity + adjustment);
    }

    decrement = (id: Id): void => {
        this.adjustQuantity(id, -1);
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

    setQuantity = (id: Id, quantity: number): void => {
        if (quantity > 0) {
            this.contents.set(id, quantity);
        } else {
            throw new BasketError(`Invalid quantity '${quantity}' for '${id}', is < 1`);
        }
    }

    // Calculate properties
    total = (): number => {
        let accumulator: number = 0.0;
        for (let [id, quantity] of this.contents) {
            accumulator += (quantity * this.shop.get(id).price);
        }
        return accumulator;
    }

    toShallowArray = (): Array<[string, number]> => {
        return Array.from(this.contents);
    }

    toDeepArray = (): Array<[Item, number]> => {
        return this.toShallowArray().map(([id, quantity]) => {
            return [this.shop.get(id), quantity];
        });
    }

    toString = (): string => {
        let lines = this.toDeepArray().map(([item, quantity]) => {
            return `${quantity}x ${item.title}`;
        });
        return lines.join("\n");
    }
}

module.exports = {
    Basket,
    Shop,
    BasketError,
    ShopError
};
