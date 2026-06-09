const User = require('../models/users'); // Import the User model to interact with the users collection in MongoDB
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating and verifying JWT tokens
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords and comparing hashed passwords
// Register new user
exports.registerUser = async (req, res) => {
     // Extract data sent from the registration form
    const { name, email, password, phone } = req.body;
    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and password are required'
        });
    }
    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({
            email: email
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);
        // Hash the password before saving it
        const hashedPassword =
            await bcrypt.hash(password, salt);
        // Create a new user document
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone

        });
        // Save the user in MongoDB
        const savedUser = await newUser.save();
        // Send success response - 201 Created 
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email
                }
        });
    } catch (error) {
        // Handle unexpected errors 
        res.status(400).json({
            success: false,
            message: error.message
      });
    }
};
// Login existing user
exports.loginUser = async (req, res) => {
    // Extract login data from request body
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }
    try {
        // Find user by email
        const user = await User.findOne({
            email: email
        });
        // Check if user exists
        if (!user) {
            return res.status(400).json({
                message: 'Wrong email or password'
            });
        }
        // Compare entered password with stored hashed password
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );
        // Check if password is correct
        if (!validPassword) {
            return res.status(400).json({
                message: 'Wrong email or password'
            });
        }
        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id  //User identifier stored inside the JWT payload
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: process.env.TOKEN_EXPIRATION // Token expiration time
            }
        );
        // Send success response
        res.status(200).json({
            success: true,
            message: 'Login successful', 
            token: token,
            user: {
                _id: user._id, // Include user ID in the response
                name: user.name, // Include user name in the response
                email: user.email // Include user email in the response
            }
        });
    // Handle unexpected errors    
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// Add lesson to favorites
exports.addFavorite = async (req, res) => {

};
// Remove lesson from favorites
exports.removeFavorite = async (req, res) => {

};