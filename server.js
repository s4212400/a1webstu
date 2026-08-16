const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock database
let users = [
    { 
        id: 1, 
        fullname: "Admin Test",
        username: "admin123", 
        email: "admin@gmail.com", 
        password: "password123",
        description: "I am the admin"
    } 
];

// API Routes
// REGISTER
app.post('/api/register', (req, res) => {
    const { fullname, username, email, description, password } = req.body;

    // Server-side Validation 1
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields!" });
    }
    // Server-side Validation 2
    const userExists = users.find(u => u.username === username || u.email === email);
    if (userExists) {
        return res.status(409).json({ error: "Username or Email is already taken!" });
    }

    const newUser = {
        id: Date.now(), 
        fullname,
        username,
        email,
        description,
        password 
    };
    
    users.push(newUser);
    
    console.log("=> Có User mới đăng ký:", newUser.username);
    res.status(201).json({ message: "Account created successfully!" });
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { emailUsername, password } = req.body;

    // Look up mock database
    const user = users.find(u => 
        (u.username === emailUsername || u.email === emailUsername) && 
        u.password === password
    );

    if (user) {
        console.log("=> User đăng nhập thành công:", user.username);
        res.status(200).json({ 
            message: "Login successful!",
            user: { 
                id: user.id, 
                fullname: user.fullname,
                username: user.username, 
                email: user.email 
            } 
        });
    } else {
        res.status(401).json({ error: "Incorrect email/username or password!" });
    }
});

// Run server
app.listen(PORT, () => {
    console.log(`🚀 NodeJS Server is running at http://localhost:${PORT}`);
});