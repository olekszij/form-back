require('dotenv').config();

const express = require('express');
const cors = require('cors');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const app = express();
app.use(express.json());
app.use(cors());

/** Mailgun config */
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

app.post('/form', async (req, res) => {
  try {
    console.log(req.body); // from input

    const { firstname, lastname, email, subject, message } = req.body;

    if (!firstname || !lastname || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `${firstname} ${lastname} <${email}>`,
      to: [process.env.MAIL_TO],
      subject: subject || 'Forms JS', // Use subject if provided, else default to 'Forms JS'
      text: message,
    });
    console.log(response);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error); // Log detailed error
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
});

app.all('*', (req, res) => {
  console.log('are you lost ?');
  res.status(404).json({ message: 'Are you lost?' });
});

app.listen(3000, () => {
  console.log('server is 🚀🚀🚀');
});
