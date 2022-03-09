const router = require("express").Router();
const Contact = require("../models/contact");
const verifyUser = require("../utils/verifyUser");
router
  .get("/all/", verifyUser, async (req, res) => {
    const { id } = req.user;
    const contacts = await Contact.find({ author: id });
    res.status(200).json(contacts);
  })
  .post("/new", verifyUser, async (req, res) => {
    const { id } = req.user;
    const { email, name, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(200).send({
        message: "Please provide all fields for contact",
        error: true,
      });
    }

    const newContact = new Contact({
      author: id,
      email,
      phone,
      name,
    });
    newContact
      .save()
      .then((saved) => {
        if (saved) {
          res.status(200).send(saved);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: err, message: "There was an error saving contact" });
      });
  })
  .delete("/delete/:cid", verifyUser, async (req, res) => {
    const { id } = req.user;

    console.log(id);
    console.log(req.params);
    const { cid } = req.params;
    console.log(cid);
    const deleted = await Contact.deleteOne({
      _id: cid,
      author: id,
    });
    if (deleted) {
      res.status(200).send({ message: "Contact deleted successfully" });
    } else {
      res.status(200).send({ message: "Contact not found" });
    }
  });

module.exports = router;
