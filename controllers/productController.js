import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    images,
    brand,
    category,
    ratings,
    isAvailable,
    offer_percentage,
  } = req.body;

  try {
    // Generate unique product_id
    const lastProduct = await Product.findOne().sort({ product_id: -1 });
    const product_id = lastProduct ? lastProduct.product_id + 1 : 1111;

    // Create a new product instance
    const newProduct = new Product({
      product_id,
      name,
      description,
      price,
      stock,
      images,
      category,
      brand,
      ratings,
      isAvailable,
      offer_percentage,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// get all product

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
