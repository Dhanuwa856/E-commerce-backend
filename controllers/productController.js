import Product from "../models/product.js";

// create new product
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

// get latest product 10
export const getLatestProducts = async (req, res) => {
  try {
    // Fetch the 10 most recently added products
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(10); // Limit to 10 results

    res.status(200).json({
      message: "Successfully fetched the latest products",
      products: latestProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch the latest products",
      error: error.message,
    });
  }
};

// get product by category
export const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  const { pageSize = 10, pageNumber = 1 } = req.query; // Default values if not provided

  try {
    let productsQuery;

    if (categoryName === "All") {
      // Fetch all products
      productsQuery = Product.find({});
    } else {
      // Fetch products specific to the category
      productsQuery = Product.find({ category: categoryName });
    }

    // Convert pageSize and pageNumber to integers
    const size = parseInt(pageSize, 10);
    const page = parseInt(pageNumber, 10);

    // Calculate total products and apply pagination
    const totalProducts = await productsQuery.clone().countDocuments();
    const products = await productsQuery.skip((page - 1) * size).limit(size);

    if (products.length === 0) {
      return res.status(404).json({
        message:
          categoryName === "All"
            ? "No products found."
            : `No products found in the ${categoryName} category.`,
      });
    }

    res.status(200).json({
      message:
        categoryName === "All"
          ? "Successfully fetched all products."
          : `Successfully fetched products in the ${categoryName} category.`,
      pageNumber: page,
      pageSize: size,
      totalProducts: totalProducts,
      totalPages: Math.ceil(totalProducts / size),
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// update product by id
export const updateProductById = async (req, res) => {
  const { productId } = req.params; // Extract product ID from URL parameters
  const updateData = req.body; // Extract update data from request body

  try {
    // Check if the product exists
    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product with the provided data
    const updatedProduct = await Product.findOneAndUpdate(
      { product_id: productId }, // Query to find product by product_id
      { $set: updateData }, // Set the updated fields
      { new: true, runValidators: true } // Return updated document and validate
    );

    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update the product.",
      error: err.message,
    });
  }
};

// delete prodct by id
export const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await Product.deleteOne({ product_id: productId });

    res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete the product.",
      error: err.message,
    });
  }
};
