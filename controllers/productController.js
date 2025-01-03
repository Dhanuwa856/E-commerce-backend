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

// get latest product 8
export const getLatestProducts = async (req, res) => {
  try {
    // Fetch the 8 most recently added products
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(8); // Limit to 8 results

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

// get products with filters
export const getProductsByCategory = async (req, res) => {
  const {
    categoryName = "All",
    pageSize = 10,
    pageNumber = 1,
    priceRange,
    sortBy,
    searchTerm,
  } = req.query;

  try {
    const filters = {};

    // Apply category filter
    if (categoryName !== "All") {
      filters.category = categoryName;
    }

    // Apply price range filter
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Apply search filter
    if (searchTerm) {
      filters.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const size = parseInt(pageSize, 10);
    const page = parseInt(pageNumber, 10);

    // Define sorting options
    const sortOptions = {
      PriceLowHigh: { price: 1 },
      PriceHighLow: { price: -1 },
      Newest: { createdAt: -1 },
      TopRated: { ratings: -1 },
    };

    const productsQuery = Product.find(filters).sort(sortOptions[sortBy] || {});

    const totalProducts = await productsQuery.clone().countDocuments();
    const products = await productsQuery.skip((page - 1) * size).limit(size);

    res.status(200).json({
      message: "Products fetched successfully.",
      filtersApplied: { categoryName, priceRange, sortBy, searchTerm },
      pageNumber: page,
      pageSize: size,
      totalProducts,
      totalPages: Math.ceil(totalProducts / size),
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products.",
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

// Get product details by product_id
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params; // Extract product_id from request parameters

    // Find the product with the matching product_id
    const product = await Product.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product details
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
