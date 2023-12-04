import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thesisadmManagement@gmail.com",
    pass: "nzcb fern ygmh zklv",
  },
});

export const sendMail = async (to, subject, body) => {
  await transporter.sendMail({
    from: "thesisadmManagement@gmail.com",
    to: to,
    subject: subject,
    text: body,
  });
};
