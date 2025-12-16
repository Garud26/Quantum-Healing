// controllers/admin/appointmentAdminController.js
const Appointment = require('../../models/Appointment');

exports.list = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.render('admin/appointments', {
      title: 'Appointment Requests',
      appointments,
      messages: req.flash(),
    });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    req.flash('error', 'Failed to load appointment requests.');
    res.render('admin/appointments', {
      title: 'Appointment Requests',
      appointments: [],
      messages: req.flash(),
    });
  }
};

// NEW: Edit (Update) appointment
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, service, preferred_date, preferred_time, message } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      req.flash('error', 'Appointment not found.');
      return res.redirect('/admin/appointments');
    }

    await appointment.update({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service.trim(),
      preferred_date,
      preferred_time,
      message: message ? message.trim() : null,
    });

    req.flash('success', 'Appointment updated successfully.');
    res.redirect('/admin/appointments');
  } catch (err) {
    console.error('Error updating appointment:', err);
    req.flash('error', 'Failed to update appointment.');
    res.redirect('/admin/appointments');
  }
};

// NEW: Delete appointment
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      req.flash('error', 'Appointment not found.');
      return res.redirect('/admin/appointments');
    }

    await appointment.destroy();
    req.flash('success', 'Appointment deleted successfully.');
    res.redirect('/admin/appointments');
  } catch (err) {
    console.error('Error deleting appointment:', err);
    req.flash('error', 'Failed to delete appointment.');
    res.redirect('/admin/appointments');
  }
};