// controllers/frontendControllers/frontController.js
const Service = require("../../models/Service");
const Blog = require("../../models/Blog");
const Banner = require("../../models/Banner");
const Rating = require("../../models/Rating");
const HomePageSetting = require("../../models/HomePageSetting");
const AboutUsSetting = require("../../models/AboutUsSetting");
const ContactSettings = require("../../models/ContactSettings");
const ImagesLogo = require("../../models/ImagesLogo"); 

class FrontController {
  
  static async loadImagesLogo(req, res, next) {
    try {
      let imagesLogo = await ImagesLogo.findOne();
      if (!imagesLogo) {
        imagesLogo = {
          logo: null,
          gallery_images: []
        };
      } else {
        
        if (!Array.isArray(imagesLogo.gallery_images)) {
          imagesLogo.gallery_images = [];
        }
      }
      res.locals.imagesLogo = imagesLogo; 
      next();
    } catch (err) {
      console.error("Error loading ImagesLogo:", err);
      res.locals.imagesLogo = { logo: null, gallery_images: [] };
      next();
    }
  }

  static async home(req, res) {
    try {
      const banners = await Banner.findAll({
        order: [["order_no", "ASC"], ["id", "DESC"]],
      });

      const recentBlogs = await Blog.findAll({
        order: [["id", "DESC"]],
        limit: 3,
      });

      const services = await Service.findAll({
        where: { is_active: true },
        order: [["order_no", "ASC"], ["id", "DESC"]],
        limit: 4,
      });

      const ratings = await Rating.findAll({
        order: [["createdAt", "DESC"]],
        limit: 6,
      });

      const homepageSettings = await HomePageSetting.findAll();
      const homepageData = {};
      homepageSettings.forEach((setting) => {
        homepageData[setting.section] = setting;
      });

      res.render("frontend/index", {
        title: "Home",
        path: "/",
        banners: banners || [],
        recentBlogs: recentBlogs || [],
        services: services || [],
        ratings: ratings || [],
        homepageData: homepageData || {},
        
      });
    } catch (err) {
      console.error("Home page error:", err);
      res.render("frontend/index", {
        title: "Home",
        path: "/",
        banners: [],
        recentBlogs: [],
        services: [],
        ratings: [],
        homepageData: {},
      });
    }
  }

  static aboutUs(req, res) {
    res.render("frontend/about-us", { title: "About Us", path: "/about-us" });
  }

  static async services(req, res) {
    try {
      const services = await Service.findAll({
        where: { is_active: true },
        order: [["order_no", "ASC"], ["id", "DESC"]],
      });

      res.render("frontend/services", {
        title: "Our Services",
        path: "/services",
        services: services || [],
      });
    } catch (error) {
      console.error(error);
      res.render("frontend/services", {
        title: "Our Services",
        path: "/services",
        services: [],
      });
    }
  }

  static async blog(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const offset = (page - 1) * limit;

      const { count, rows } = await Blog.findAndCountAll({
        order: [["id", "DESC"]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      res.render("frontend/blog", {
        title: "Blog",
        path: "/blog",
        blogs: rows,
        pagination: {
          current: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          baseUrl: "/blog",
        },
      });
    } catch (error) {
      console.error("Blog list error:", error);
      res.render("frontend/blog", {
        title: "Blog",
        path: "/blog",
        blogs: [],
        pagination: null,
      });
    }
  }

  static async blogDetail(req, res) {
    try {
      const id = parseInt(req.params.id);
      const blog = await Blog.findByPk(id);

      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/blog");
      }

      let relatedBlogs = [];

      if (blog.tags) {
        let tags = [];
        try {
          if (Array.isArray(blog.tags)) {
            tags = blog.tags;
          } else {
            tags = JSON.parse(blog.tags);
          }
        } catch (e) {
          tags = blog.tags.split(",").map((t) => t.trim()).filter((t) => t);
        }

        if (tags.length > 0) {
          relatedBlogs = await Blog.findAll({
            where: {
              id: { [require("sequelize").Op.ne]: id },
              tags: { [require("sequelize").Op.like]: `%${tags[0]}%` },
            },
            order: [["id", "DESC"]],
            limit: 6,
          });
        }
      }

      if (relatedBlogs.length < 3) {
        const fallback = await Blog.findAll({
          where: {
            id: { [require("sequelize").Op.ne]: id },
          },
          order: [["id", "DESC"]],
          limit: 6,
        });

        relatedBlogs = [...relatedBlogs, ...fallback]
          .filter((b, index, self) => index === self.findIndex((x) => x.id === b.id))
          .slice(0, 6);
      }

      res.render("frontend/blog-detail", {
        title: blog.title,
        path: "/blog",
        blog,
        relatedBlogs,
      });
    } catch (error) {
      console.error("Blog detail error:", error);
      req.flash("error", "Something went wrong");
      res.redirect("/blog");
    }
  }

  static contact(req, res) {
    res.render("frontend/contact", { title: "Contact", path: "/contact" });
  }

  // Appointment page 
  static async appointment(req, res) {
    try {
      const services = await Service.findAll({
        where: { is_active: true },
        order: [["order_no", "ASC"], ["id", "DESC"]],
      });

      const old = req.flash('old')[0] || null;

      res.render("frontend/appointment", {
        title: "Appointment",
        path: "/appointment",
        services: services || [],
        old: old,
      });
    } catch (err) {
      console.error("Error loading appointment page:", err);
      res.render("frontend/appointment", {
        title: "Appointment",
        path: "/appointment",
        services: [],
        old: null,
      });
    }
  }

  static async aboutUs(req, res) {
    try {
      const setting = await AboutUsSetting.findOrCreateDefault();
      const ratings = await Rating.findAll({
        order: [["createdAt", "DESC"]],
        limit: 6,
      });

      res.render("frontend/about-us", {
        title: "About Us",
        path: "/about-us",
        setting,
        ratings,
      });
    } catch (err) {
      console.error(err);
      res.render("frontend/about-us", {
        title: "About Us",
        path: "/about-us",
        setting: {},
        ratings: [],
      });
    }
  }

  static async contact(req, res) {
    try {
      const contactSetting = (await ContactSettings.findOne()) || {};

      res.render("frontend/contact", {
        title: "Contact",
        path: "/contact",
        contactSetting: contactSetting,
        messages: req.flash(),
      });
    } catch (err) {
      console.error("Contact page error:", err);
      res.render("frontend/contact", {
        title: "Contact",
        path: "/contact",
        contactSetting: {},
        messages: req.flash(),
      });
    }
  }
}

module.exports = FrontController;