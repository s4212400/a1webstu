const express = require("express");

const router = express.Router();

const wishlist = require("./wishlist");


// ================================
// SHOW WISHLIST
// ================================

router.get("/", (req, res) => {

    const user = req.session ? req.session.user : null;

    res.render("wishlist", {
        user,
        wishlist
    });

});


// ================================
// MOVE TO CART
// ================================

router.get("/move/:id", (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect("/wishlist");
    }

    // Không cho move nếu đã purchased
    if (item.isPurchased) {
        return res.redirect("/wishlist");
    }

    // Không cho move nếu hết hàng
    if (item.stock === "Out of Stock") {
        return res.redirect("/wishlist");
    }

    // Tạm thời đánh dấu đã thêm vào cart
    item.addedToCart += 1;

    return res.redirect("/wishlist");

});


// ================================
// MARK PURCHASED
// ================================

router.get("/purchase/:id", (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect("/wishlist");
    }

    item.isPurchased = true;

    return res.redirect("/wishlist");

});


// ================================
// MARK UNPURCHASED
// ================================

router.get("/unpurchase/:id", (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect("/wishlist");
    }

    item.isPurchased = false;

    return res.redirect("/wishlist");

});


// ================================
// REMOVE FROM WISHLIST
// ================================

router.get("/remove/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = wishlist.findIndex(item => item.id === id);

    if (index === -1) {
        return res.redirect("/wishlist");
    }

    wishlist.splice(index, 1);

    return res.redirect("/wishlist");

});


module.exports = router;