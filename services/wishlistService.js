const Wishlist = require('../models/wishlist');
const Product = require('../models/product');


// ============================================================
// GET USER WISHLIST
// ============================================================

async function getWishlist(userId) {

    let wishlist = await Wishlist.findOne({ userId })
        .populate('items.productId');

    if (!wishlist) {

        wishlist = await Wishlist.create({
            userId,
            items: []
        });

    }

    return wishlist;
}


// ============================================================
// ADD PRODUCT TO WISHLIST
// ============================================================

async function addToWishlist(userId, productNumber) {

    const product = await Product.findOne({
        productId: Number(productNumber)
    });

    if (!product) {
        throw new Error('Product does not exist.');
    }


    let wishlist =
        await Wishlist.findOne({ userId });


    if (!wishlist) {

        wishlist = new Wishlist({
            userId,
            items: []
        });

    }


    const existingItem =
        wishlist.items.find(
            item =>
                item.productId.toString() ===
                product._id.toString()
        );


    // Already in wishlist
    if (existingItem) {

        existingItem.wishlistClicks =
            (existingItem.wishlistClicks || 1) + 1;

    }

    // New wishlist item
    else {

        wishlist.items.push({

            productId: product._id,

            productNumber:
                product.productId,

            name:
                product.name,

            image:
                product.image,

            platform:
                product.platform,

            category:
                product.category,

            price:
                product.price,

            oldPrice:
                product.oldPrice,

            discount:
                product.discount || 0,

            rating:
                product.rating,

            ratingCount:
                product.ratingCount || 0,

            stock:
                product.stock,

            wishlistClicks:
                1,

            addedToCart:
                0,

            purchasedCount:
                0,

            isPurchased:
                false,

            addedDate:
                new Date()

        });

    }


    await wishlist.save();


    return await Wishlist.findOne({ userId })
        .populate('items.productId');
}


// ============================================================
// REMOVE FROM WISHLIST
// ============================================================

async function removeFromWishlist(
    userId,
    itemId
) {

    const wishlist =
        await Wishlist.findOne({ userId });


    if (!wishlist) {
        return null;
    }


    wishlist.items =
        wishlist.items.filter(
            item =>
                item._id.toString() !==
                itemId.toString()
        );


    await wishlist.save();


    return await Wishlist.findOne({ userId })
        .populate('items.productId');
}


// ============================================================
// MARK AS PURCHASED
// ============================================================

async function markPurchased(
    userId,
    itemId
) {

    const wishlist =
        await Wishlist.findOne({ userId });


    if (!wishlist) {
        return null;
    }


    const item =
        wishlist.items.id(itemId);


    if (!item) {
        return null;
    }


    item.isPurchased = true;

    item.purchasedCount =
        (item.purchasedCount || 0) + 1;


    await wishlist.save();


    return item;
}


// ============================================================
// MARK AS UNPURCHASED
// ============================================================

async function markUnpurchased(
    userId,
    itemId
) {

    const wishlist =
        await Wishlist.findOne({ userId });


    if (!wishlist) {
        return null;
    }


    const item =
        wishlist.items.id(itemId);


    if (!item) {
        return null;
    }


    item.isPurchased = false;


    await wishlist.save();


    return item;
}


// ============================================================
// INCREASE ADDED TO CART COUNT
// ============================================================

async function incrementAddedToCart(
    userId,
    itemId
) {

    const wishlist =
        await Wishlist.findOne({ userId });


    if (!wishlist) {
        return null;
    }


    const item =
        wishlist.items.id(itemId);


    if (!item) {
        return null;
    }


    item.addedToCart =
        (item.addedToCart || 0) + 1;


    await wishlist.save();


    return item;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getWishlist,

    addToWishlist,

    removeFromWishlist,

    markPurchased,

    markUnpurchased,

    incrementAddedToCart

};