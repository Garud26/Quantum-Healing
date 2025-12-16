// controllers/blogController.js
const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");

module.exports = {
  
  list: async (req, res) => {
    try {
      const blogs = await Blog.findAll({ order: [["created_at", "DESC"]] });
      res.render("admin/blogs/blog-list", {
        blogs,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Error fetching blogs");
      res.redirect("/admin/dashboard");
    }
  },


  addPage: (req, res) => {
    res.render("admin/blogs/add-blog", {
      user: req.session.user,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  },

  add: async (req, res) => {
    const { title, content, author, tags } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content) {
      if (image) fs.unlinkSync(path.join("public/uploads", image));
      req.flash("error", "Title and content are required");
      return res.redirect("/admin/blogs/add");
    }

    // Convert "tag1, tag2, tag3" → ["tag1", "tag2", "tag3"]
    const tagsArray = tags
      ? tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [];

    try {
      await Blog.create({
        title,
        content,
        author: author || req.session.user?.name || "Admin",
        image,
        tags: tagsArray,
      });
      req.flash("success", "Blog added successfully");
      res.redirect("/admin/blogs");
    } catch (err) {
      console.error(err);
      if (image) fs.unlinkSync(path.join("public/uploads", image));
      req.flash("error", "Error adding blog");
      res.redirect("/admin/blogs/add");
    }
  },

  editPage: async (req, res) => {
    try {
      const blog = await Blog.findByPk(req.params.id);
      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/admin/blogs");
      }

      // Convert tags array → "tag1, tag2" for input field
      const tagsString = Array.isArray(blog.tags) ? blog.tags.join(", ") : "";

      res.render("admin/blogs/edit-blog", {
        blog,
        tagsString,
        user: req.session.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Error loading blog");
      res.redirect("/admin/blogs");
    }
  },

  update: async (req, res) => {
    const { title, content, author, tags } = req.body;

    if (!title || !content) {
      req.flash("error", "Title and content are required");
      return res.redirect(`/admin/blogs/edit/${req.params.id}`);
    }

    try {
      const blog = await Blog.findByPk(req.params.id);
      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/admin/blogs");
      }

      const image = req.file ? req.file.filename : blog.image;

      if (req.file && blog.image) {
        const oldImagePath = path.join("public/uploads", blog.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      const tagsArray = tags
        ? tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
        : [];

      await blog.update({
        title,
        content,
        author: author || req.session.user?.name || "Admin",
        image,
        tags: tagsArray,
      });

      req.flash("success", "Blog updated successfully");
      res.redirect("/admin/blogs");
    } catch (err) {
      console.error(err);
      req.flash("error", "Error updating blog");
      res.redirect(`/admin/blogs/edit/${req.params.id}`);
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blog = await Blog.findByPk(req.params.id);
      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/admin/blogs");
      }

      if (blog.image) {
        const imagePath = path.join("public/uploads", blog.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await blog.destroy();
      req.flash("success", "Blog deleted successfully");
      res.redirect("/admin/blogs");
    } catch (err) {
      console.error(err);
      req.flash("error", "Error deleting blog");
      res.redirect("/admin/blogs");
    }
  },
};