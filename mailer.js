const nodemailer = require('nodemailer');


function sendEmail(message) {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "hadhemi.sahbani@gmail.com",
        pass: "Leetaemin1993"
      }
    })

    transporter.sendMail(message, function(err, info) {
      if (err) {
        rej(err)
      } else {
        res(info)
      }
    })
  })
}

exports.sendConfirmationEmail = function({toUser, hash}) {
  const message = {
    from: "hadhemi.sahbani@gmail.com",
    // to: toUser.email // in production uncomment this
    to: toUser.email,
    subject: 'Your App - Activate Account',
    html: `
      <h3> Hello ${toUser.name} </h3>
      <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
      <p>To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/activate/user/${hash}">${process.env.DOMAIN}/activate </a></p>
      <p>Cheers</p>
      <p>Your Application Team</p>
    `
  }

  return sendEmail(message);
}

exports.sendResetPasswordEmail = ({toUser, hash}) => {
  const message = {
    from: "hadhemi.sahbani@gmail.com",
    // to: toUser.email // in production uncomment this
    to: toUser.email,
    subject: 'Your App - Reset Password',
    html: `
      <h3>Hello ${toUser.name} </h3>
      <p>To reset your password please follow this link: <a target="_" href="http://localhost:8080/pages/authentication/reset-password-v1/${hash}">Reset Password Link</a></p>
      <p>Cheers,</p>
      <p>Your Application Team</p>
    `
  }
  return sendEmail(message);
}
  exports.sendAcceptationEmail = ({toUser}) => {
    const message = {
      from: "hadhemi.sahbani@gmail.com",
      // to: toUser.email // in production uncomment this
      to: toUser.email,
      subject: 'Your App - Accept register ',
      html: `
        <h3>Hello ${toUser.name} </h3>
        <p>request approved</a></p>
        <p>Cheers,</p>
        <p>Your Application Team</p>
      `
    }

  return sendEmail(message);
}

exports.sendRefuseEmail = ({toUser}) => {
  const message = {
    from: "hadhemi.sahbani@gmail.com",
    // to: toUser.email // in production uncomment this
    to: toUser.email,
    subject: 'Your App - Refuse register ',
    html: `
      <h3>Hello ${toUser.name} </h3>
      <p>sorry to inform you</a></p>
      <p>Cheers,</p>
      <p>Your Application Team</p>
    `
  }

return sendEmail(message);
}