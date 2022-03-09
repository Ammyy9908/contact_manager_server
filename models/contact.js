const { model, Schema } = require("mongoose");

const contact_schema = new Schema({
  author: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Contact = model("contact", contact_schema);

module.exports = Contact;
