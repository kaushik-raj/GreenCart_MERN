import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"



// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        // Taking the product data from the request body
        let productData = JSON.parse(req.body.productData)
        // taking the images from the request files
        const images = req.files
        // You run all uploads at the same time and wait for them together:
        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        // saving the productData with imagesUrl into the Product collection .
        await Product.create({...productData, image: imagesUrl})

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get All Product : /api/product/list
export const productList = async (req, res)=>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
        // Taking the product id from the request body , id is sent from the frontend
        // when the user clicks on a product to view its details.
        const { id } = req.body

        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        // Taking the product id and inStock value from the request body
        // id is sent from the frontend when the user clicks on a product to change its stock
        // instack is the chnaged stock value. 
        const { id, inStock } = req.body

        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
