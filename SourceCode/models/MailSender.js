const nodemailer = require('nodemailer');

module.exports = class MailSender{


/*    static myMail = 'kamp.mlade.nade.msf@gmail.com';
    static myPwd = 'MajstoriSFera7$';
    static link = 'localhost:3000/registracija/final';

    static transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.myMail,
        pass: this.myPwd
      }
    });
    
*/
    static send(recipient, user, message) {
        let myMail = 'kamp.mlade.nade.msf@gmail.com';
        let myPwd = 'MajstoriSFera7$';
        let link = 'http://localhost:3000/registracija/final';
    
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: myMail,
            pass: myPwd
          }
        });
        
        let mailOptions = {}
    
        if(message == 'accepted') {
            mailOptions = {
                from: myMail,
                to: recipient,
                subject: 'Čestitamo! Primljeni ste u naš kamp!',
                text: `Završite registraciju se na linku ${link} koristeći korisničko ime: ${user}.` 
            };

        } else if(message == 'denied') {
            mailOptions = {
                from: this.myMail,
                to: recipient,
                subject: 'Vaš zahtjev je obijen',
                text: `Nažalost niste primljeni na naš kamp. Više sreće iduće godine!` 
            };
            
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              //console.log('Email sent: ' + info.response);
            }
        });
        return mailOptions;
    }
}

