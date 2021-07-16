const assert = require('assert');
const MailSender = require('../models/MailSender');

describe('Mail Sender Test', () => {
    
    it('treba vratiti poruku prihvaćanja', () => {
        let mailOptions = MailSender.send("korisnik@random.com", "krandom", "accepted");
        assert.equal(mailOptions.subject, 'Čestitamo! Primljeni ste u naš kamp!');
    });

    it('treba vratiti poruku odbijanja', () => {
        let mailOptions = MailSender.send("korisnik2@random.com", "krandom2", "denied");
        assert.equal(mailOptions.subject, 'Vaš zahtjev je obijen');
    });
});