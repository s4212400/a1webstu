# ConsoleHaven — Gaming E-Commerce & Community Platform

COSC3060|61 Web Programming Studio — Assignment 3 (Group Project)

An e-commerce and community platform for gaming hardware, retro consoles and tech gear.
This repository contains the source code for the Web Development Group Assignment.

## Team Members & Task Distribution
This project was developed collaboratively by a team of 4 members. Below is the module breakdown:

*   **Member 1: Nguyen Minh Tri (SID: S4155540 )**
    *   Module: Shopping Cart & Checkout + Wishlist
    *   Shared pages & CSS Custom: Profile, Profile-Edit, Forgot-Password Page. 
    *   Header/Footer
*   **Member 2: Nguyen Trong Giap (SID: S4188314 )**
    *   Module: Discussion Forum
    *   Shared pages & CSS Custom: Sitemap, Policy Service, Password-Reset-Sent.
*   **Member 3: Luong Gia Minh (SID: S4212400 )**
    *   Module: Blog & Authentication 
    *   Shared pages & CSS Custom: Login, Register, Logout Page.
*   **Member 4: Luong Quoc Viet(SID: S4154250 )**
    *   Module: Product Review and Rating
    *   Shared pages & CSS Custom: Admin, Delete account, Deactivate account.

## Live Website URL
https://a1webstu.onrender.com/?fbclid=IwY2xjawUQm4xwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMUZNY3h0aVFSelpySGRndUNzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeA_r_gJUFCAH3BMarrlYKB-_UyjcWrRZrhemtuo3kbKoKpPP_-USDsVzdwz0_aem_w3trgfYdzBy1HsY-r3mUCA

## GitHub Repository URL
https://github.com/s4212400/a1webstu.git

## Test User Credentials
| Username | Password | Role |
|---|---|---|
| hoangn | password123 | Standard user |
| tienn | password123 | Standard user |
| minhtri | password123 | Standard user |

## Admin Credentials
| Username | Password | Role |
|---|---|---|
| admin123 | password123 | Admin |

## MongoDB Connection Details / Setup Instructions
1. Clone this repository.
2. Run `npm install` to install dependencies (express, ejs, mongoose, bcrypt, express-session, dotenv).
3. Create a `.env` file in the project root containing:
   ```
   MONGODB_URI=<your MongoDB Atlas connection string>
   ```
4. Run `node seed.js` once to populate sample data (users, products, reviews, blogs, forum threads).
5. Run `node server.js` (or `npm start`) to start the server locally on port 3000.

For deployment on Render.com:
- Build Command: `npm install`
- Start Command: `npm start`
- The `MONGODB_URI` environment variable is set through the Render dashboard (not committed to the repository).

## Instructions Required for Marking
- Use the admin account above to access the Admin dashboard at `/admin` (search, filter, sort users; lock/unlock; delete).
- Use any test user account to demonstrate Reviews (`/reviews`), Cart (`/cart`), Wishlist (`/wishlist`), Forum (`/forum`), Blog (`/blog`), and Profile (`/profile`).
- Product reviews are shown on each product's detail page (`/product/:id`).
- Sample data is seeded via `node seed.js` — re-run it if the database needs to be reset.