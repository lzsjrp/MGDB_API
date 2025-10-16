import prisma from "../lib/prisma.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", errorDetails: error });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.categories.create({
      data: { name },
    });
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category", errorDetails: error });
  }
}

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    await prisma.categories.delete({
      where: { id: categoryId },
    });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", errorDetails: error });
  }
}

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: { name },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", errorDetails: error });
  }
}

export const addBookToCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { bookId } = req.body;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    if (category.booksIds.includes(bookId)) {
      return res.status(400).json({ error: "Book already in category" });
    }
    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: { booksIds: { push: bookId } },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
    res.status(200).json({ message: "Book added to category successfully", bookId, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book to category", errorDetails: error });
  } 
}

export const deleteBookFromCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { bookId } = req.body;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    if (!category.booksIds.includes(bookId)) {
      return res.status(400).json({ error: "Book not in category" });
    }
    const updatedBooksIds = category.booksIds.filter(id => id !== bookId);
    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: { booksIds: updatedBooksIds },
      select: { id: true, name: true, createdAt: true, updatedAt: true },

    });
    res.status(200).json({ message: "Book removed from category successfully", bookId, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove book from category", errorDetails: error });
  }
}

export const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category", errorDetails: error });
  }
}