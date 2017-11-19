# shopping-basket-js
[![npm](https://img.shields.io/npm/v/shopping-basket-js.svg)](https://www.npmjs.com/package/shopping-basket-js)
[![license](https://img.shields.io/github/license/tommilligan/shopping-basket-js.svg)]()

[![Travis branch](https://img.shields.io/travis/tommilligan/shopping-basket-js/develop.svg)](https://travis-ci.org/tommilligan/shopping-basket-js)
[![codecov](https://codecov.io/gh/tommilligan/shopping-basket-js/branch/develop/graph/badge.svg)](https://codecov.io/gh/tommilligan/shopping-basket-js)
[![David](https://img.shields.io/david/tommilligan/shopping-basket-js.svg)](https://david-dm.org/tommilligan/shopping-basket-js)

A simple shopping basket in Javascript.

## Install

This module is not hosted on npm - to try it out, clone the repo and install from the local filesystem

```bash
# Clone and build the library
git clone https://github.com/tommilligan/shopping-basket-js
cd shopping-basket-js/
yarn
yarn build

# Add it as a dependency to your project
cd ..
mkdir my-awesome-project
cd my-awesome-project/
yarn add file:../shopping-basket-js/
```

## Usage

The `Shop` contains multiple `Item`s, which can then be added to a `Basket`.

We start by setting up our shop and the items:
```node
// @flow

import { Shop, Basket } from "shopping-basket";

// If you use flow, types are available
import type { Item } from "shopping-basket";

let items: Array<Item> = [
    {id: "BREAD", price: 0.90, title: "Bread (Wholemeal)"},
    {id: "MILK", price: 1.49, title: "Milk (2L)"}
];

let shop = new Shop(items);
```

We can then create baskets attached to this shop, and use items by their id!
```node
let basket = new Basket(shop);
basket.add("BREAD");
```

We can alter quantites or remove items altogether:
```node
basket.increment("BREAD");
basket.setQuantity("MILK", 5);

basket.toString();
// 2x Bread (Wholemeal)
// 5x Milk (2L)

basket.remove("BREAD");
basket.setQuantity("MILK", 3);

basket.toString();
// 3x Milk (2L)
```

We can access the basket items `Map` directly:
```node
for (let [id, quantity] of basket.contents) {
    // do stuff with basket contents
}
```

or through an array representation:
```node
basket.empty();
basket.add("BREAD");

basket.toShallowArray();
// [["BREAD", 1]]
```

There is also a helper for getting the full data structure:
```
basket.toDeepArray();
// [[{id: "BREAD", price: 0.90, title: "Bread (Wholemeal)"}, 1]]
```

Finally, we can find the price of our basket:
```node
basket = new Basket(shop);
basket.setQuantity("BREAD", 9);
let total = basket.total();
// 8.1
console.log(`£${total.toFixed(2)}`);
// £8.10
```

