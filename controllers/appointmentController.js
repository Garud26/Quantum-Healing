// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const { validationResult } = require("express-validator");
const sendMail = require("../utils/mailer");

exports.submit = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    req.flash("error", errorMessages.join(" "));
    req.flash("old", req.body);
    return res.redirect("/appointment");
  }

  try {
    const {
      name,
      email,
      phone,
      service,
      preferred_date,
      preferred_time,
      message,
    } = req.body;

    await Appointment.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service.trim(),
      preferred_date,
      preferred_time,
      message: message ? message.trim() : null,
      status: 'Pending'  // ← Explicitly set on creation
    });

    // Email to Admin
    await sendMail({
      to: process.env.ADMIN_MAIL,
      subject: "New Appointment Request",
      html: `
        <h2>New Appointment Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${preferred_date}</p>
        <p><strong>Time:</strong> ${preferred_time}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
      `,
    });

    // Email to User
    await sendMail({
      to: email,
      subject: "Appointment Request Received",
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>Your appointment request has been received successfully.</p>
        <h4>Appointment Details:</h4>
        <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date:</strong> ${preferred_date}</li>
          <li><strong>Time:</strong> ${preferred_time}</li>
        </ul>
        <p>Our team will contact you shortly.</p>
        <p>Thank you for choosing us!</p>
      `,
    });

    req.flash("success", "Thank you! Your appointment request has been submitted successfully.");
    res.redirect("/appointment");
  } catch (err) {
    console.error("Appointment submission error:", err);
    req.flash("error", "Something went wrong. Please try again later.");
    req.flash("old", req.body);
    res.redirect("/appointment");
  }
};

// NEW: Update Status + Send Email
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      req.flash("error", "Appointment not found.");
      return res.redirect("/admin/appointments");
    }

    const oldStatus = appointment.status;
    await appointment.update({ status });

    // Send email only on meaningful changes
    if (["Processing", "Confirmed", "Completed"].includes(status) && status !== oldStatus) {
      let subject = "";
      let messageBody = "";

      switch (status) {
        case "Processing":
          subject = "Your Appointment is Being Processed";
          messageBody = `Your appointment for <strong>${appointment.service}</strong> on <strong>${new Date(appointment.preferred_date).toLocaleDateString()}</strong> at <strong>${appointment.preferred_time.slice(0,5)}</strong> is now being processed. We will confirm soon.`;
          break;
        case "Confirmed":
          subject = "Your Appointment Has Been Confirmed!";
          messageBody = `Great news! Your appointment for <strong>${appointment.service}</strong> is <strong>CONFIRMED</strong>.<br><br>
                         <strong>Date:</strong> ${new Date(appointment.preferred_date).toLocaleDateString()}<br>
                         <strong>Time:</strong> ${appointment.preferred_time.slice(0,5)}<br><br>
                         We look forward to seeing you!`;
          break;
        case "Completed":
          subject = "Appointment Completed – Thank You!";
          messageBody = `Your appointment on ${new Date(appointment.preferred_date).toLocaleDateString()} has been marked as completed.<br><br>
                         We hope you had a great experience. Feel free to book again!`;
          break;
      }

      await sendMail({
        to: appointment.email,
        subject,
        html: `
          <h2>${subject}</h2>
          <p>Dear <strong>${appointment.name}</strong>,</p>
          <p>${messageBody}</p>
          <hr>
          <p>Best regards,<br><strong>Quantum Healing Chiropractic</strong></p>
        `,
      });
    }

    req.flash("success", `Status updated to "${status}". Notification sent if applicable.`);
    res.redirect("/admin/appointments");
  } catch (err) {
    console.error("Status update error:", err);
    req.flash("error", "Failed to update status.");
    res.redirect("/admin/appointments");
  }
};