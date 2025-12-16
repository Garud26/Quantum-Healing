// controllers/imagesLogoController.js
const ImagesLogo = require("../models/ImagesLogo");
const fs = require("fs");
const path = require("path");

// Get the settings page (only one record)
exports.index = async (req, res) => {
  try {
    let record = await ImagesLogo.findOne();
    if (!record) {
      // In case migration didn't insert the row
      record = await ImagesLogo.create({
        gallery_images: [], // Ensure it's an array from the start
      });
    }

    // FIX: Ensure gallery_images is always an array
    if (record.gallery_images) {
      // If it's a string (e.g. from raw SQL or old data), parse it
      if (typeof record.gallery_images === "string") {
        try {
          record.gallery_images = JSON.parse(record.gallery_images);
        } catch (e) {
          console.error("Failed to parse gallery_images JSON:", e);
          record.gallery_images = [];
        }
      }
      // If it's null or undefined, make it empty array
      if (!Array.isArray(record.gallery_images)) {
        record.gallery_images = [];
      }
    } else {
      record.gallery_images = [];
    }

    res.render("admin/images-logo", { record, title: "Images & Logo Settings" });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load images & logo settings.");
    res.redirect("/admin/dashboard");
  }
};

// Update the images
exports.update = async (req, res) => {
  try {
    let record = await ImagesLogo.findOne();
    if (!record) record = await ImagesLogo.create({ gallery_images: [] });

    // Handle Logo (single file)
    if (req.files && req.files["logo"] && req.files["logo"].length > 0) {
      // Delete old logo if exists
      if (record.logo) {
        const oldPath = path.join(__dirname, "..", "public", record.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      record.logo = "/uploads/" + req.files["logo"][0].filename;
    }

    // Handle Gallery Images (multiple files)
    if (req.files && req.files["gallery_images"] && req.files["gallery_images"].length > 0) {
      // Delete old gallery images
      if (record.gallery_images && Array.isArray(record.gallery_images)) {
        record.gallery_images.forEach(oldImg => {
          const oldPath = path.join(__dirname, "..", "public", oldImg);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        });
      }

      // Save new uploaded images as array of paths
      const newImages = req.files["gallery_images"].map(file => "/uploads/" + file.filename);
      record.gallery_images = newImages; // Always store as array
    }
    // If no new gallery images uploaded, keep existing ones

    await record.save();

    req.flash("success", "Images & Logo updated successfully!");
    res.redirect("/admin/images-logo");
  } catch (err) {
    console.error("Update error:", err);
    req.flash("error", "Something went wrong while saving!");
    res.redirect("/admin/images-logo");
  }
};