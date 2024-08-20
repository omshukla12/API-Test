const express = require("express");
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const fetch = require("node-fetch");

mongoose.connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error.message));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello");
});


const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    rating: Number,
    discount: Number,
    availability: String
});

const Product = mongoose.model("Product", productSchema);

function getData() {
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO']; 
    const products = ['Laptop', 'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger', 'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset', 'PC']; 
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0MTYxOTM2LCJpYXQiOjE3MjQxNjE2MzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImNmOGE2MjA2LWQyZjItNGI5Zi1hNDQwLTUwZTA4MWNlMDM1YiIsInN1YiI6ImFudXJhZ2QyNzVAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiYnV5LXNtYXJ0IiwiY2xpZW50SUQiOiJjZjhhNjIwNi1kMmYyLTRiOWYtYTQ0MC01MGUwODFjZTAzNWIiLCJjbGllbnRTZWNyZXQiOiJmUWhoVmt0SU1sR3NTWkdNIiwib3duZXJOYW1lIjoiQW51cmFnIER1YmV5Iiwib3duZXJFbWFpbCI6ImFudXJhZ2QyNzVAZ21haWwuY29tIiwicm9sbE5vIjoiMjEwMDU2MDEwMDAzMyJ9.rvyVuP7FWn0KFoKLE8zxFLaG1qa251J7Y_l8ByLv4MQ';

    companies.forEach(company => {
        products.forEach(product => {
            const API_ENDPOINT = `http://20.244.56.144/test/companies/${company}/categories/${product}/products?top=10&minPrice=1&maxPrice=10000`;
            fetch(API_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json', 
                }
            })
            .then(response => response.json())
            .then(async data => {

                for (let item of data) {
                    const { productName, price, rating, discount, availability } = item;


                    const newProduct = new Product({
                        productName,
                        price,
                        rating,
                        discount,
                        availability
                    });

                    
                    await newProduct.save();
                }

                
                const sortedProducts = await Product.find().sort({ price: 1 });
                res.json(sortedProducts);
            })
            .catch(error => console.error('Error:', error));
        });
    });
}

app.get("/fetch-products", (req, res) => {
    getData();
});

app.listen(3000, () => console.log("Server running on port 3000"));
