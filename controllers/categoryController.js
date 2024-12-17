import Category from "../models/category.js";
import Product from "../models/product.js";

// Create a new category
export const crateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: `${name} Category already exists` });
    }
    const category = await Category.create({ name, description, image });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category by name
export const updateCategory = async (req, res) => {
  const { name } = req.params; // Get the category name from URL params
  const { description, image } = req.body; // Get updated fields from request body

  try {
    // Find category by name (case-insensitive)
    const category = await Category.findOne({
      name: name,
    });

    if (!category) {
      return res.status(404).json({ message: `Category '${name}' not found` });
    }

    // Update the fields only if new values are provided
    category.description = description || category.description;
    category.image = image || category.image;

    // Save the updated category
    const updatedCategory = await category.save();
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a category by name
export const deleteCategory = async (req, res) => {
  const { name } = req.params;

  try {
    const category = await Category.findOne({ name: name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update offer percentage
export const updateCategoryOffer = async (req, res) => {
  const { categoryName } = req.params;
  const { offer_percentage } = req.body;

  try {
    // Validate the offer percentage
    if (offer_percentage < 0 || offer_percentage > 100) {
      return res
        .status(400)
        .json({ message: "Offer percentage must be between 0 and 100" });
    }

    // Find the category
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category's offer_percentage
    category.offer_percentage = offer_percentage;
    await category.save();

    // Update all products in the same category
    const result = await Product.updateMany(
      { category: categoryName },
      { $set: { offer_percentage } }
    );

    res.status(200).json({
      message: `Offer updated for category '${categoryName}' and applied to ${result.nModified} product(s)`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// adjust price by category
export const adjustCategoryPrices = async (req, res) => {
  const { categoryName } = req.params;
  const { adjustmentPercentage } = req.body; // Positive or negative percentage

  try {
    // Find the category
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Optional: Save the adjustment percentage in the category model
    category.price_adjustment = adjustmentPercentage;
    await category.save();

    // Calculate adjustment factor
    const adjustmentFactor = 1 + adjustmentPercentage / 100;

    // Fetch all products in the category
    const products = await Product.find({ category: categoryName });

    // Update each product's price with rounding
    let updatedCount = 0;
    for (const product of products) {
      const newPrice = parseFloat(
        (product.price * adjustmentFactor).toFixed(2)
      ); // Calculate and round
      if (newPrice !== product.price) {
        // Check if the price is actually changing
        product.price = newPrice; // Update the price
        await product.save(); // Save the updated product
        updatedCount++;
      }
    }

    res.status(200).json({
      message: `Prices in the ${categoryName} category adjusted by ${adjustmentPercentage}%`,
      updatedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
