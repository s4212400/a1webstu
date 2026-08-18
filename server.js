const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./')); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MOCK DATABASE 
let users = [
    { id: 1, fullname: "Admin Test", username: "admin123", email: "admin@gmail.com", password: "password123", description: "I am the admin" }
];

let blogs = []; 

// ROUTES REGISTER

app.get('/register', (req, res) => {
    res.render('register', { error: null }); 
});

app.post('/register', (req, res) => {
    const { fullname, username, email, description, password } = req.body;

    if (!username || !email || !password) {
        return res.render('register', { error: "Please fill in all required fields!" });
    }

    const userExists = users.find(u => u.username === username || u.email === email);
    if (userExists) {
        return res.render('register', { error: "Username or Email is already taken!" });
    }

    const newUser = { id: users.length + 1, fullname, username, email, description, password };
    users.push(newUser);
    console.log("=> Successfully registered:", username);
    
    res.redirect('/login');
});

// ROUTES LOGIN

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { emailUsername, password } = req.body;

    const user = users.find(u => 
        (u.username === emailUsername || u.email === emailUsername) && u.password === password
    );

    if (!user) {
        return res.render('login', { error: "Invalid username or password!" });
    }

    console.log("=> Successfully logged in:", user.username);

    res.redirect('/'); 
});

// ROUTES TRANG CHỦ & BLOG

app.get('/', (req, res) => {
    res.render('index', { blogs: blogs });
});

app.get('/blog', (req, res) => {
    res.render('blog', { blogs: blogs });
});

app.get('/blog-create', (req, res) => {
    res.render('blog-create');
});

app.post('/blog-create', (req, res) => {
    const { title, author, date, category, tags, image, content } = req.body;

    const newPost = {
        id: Date.now(), 
        title, 
        author, 
        date, 
        category, 
        tags,
        content,
        imageUrl: image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    };

    blogs.unshift(newPost);
    console.log("=> Successfully created new blog:", title);

    res.redirect('/blog');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});