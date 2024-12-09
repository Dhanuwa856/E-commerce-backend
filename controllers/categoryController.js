import Category from "../models/category.js";

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
