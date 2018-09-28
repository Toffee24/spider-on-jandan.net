const nodemailer = require('nodemailer')

module.exports = function(errorInfo) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    auth: {
      user: 'poopmp5',
      pass: 'svzftprtbvoybij1',
    },
  })
  let mailOptions = {
    from: '"node Spider" <poopmp5@163.com>', // sender address
    to: 'toffee24@foxmail.com', // list of receivers
    subject: 'Spider Error❌', // Subject line
    text: errorInfo, // html body
  }
  transporter.sendMail(mailOptions, (error, info) => {
    process.exit(1)
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  })
}
//sendMail('Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>')