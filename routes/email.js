const _ = require('lodash');
const express = require('express');
const router = express.Router();


//-------------- Email Service ---------------//


router.post('/getallemails', (req, res) => {

    console.log(req.body);
    var imaps = require('imap-simple');


    var config = {
        imap: {
            user: req.body.user,
            password: req.body.password,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    };

    imaps.connect(config).then(function (connection) {

        return connection.openBox('INBOX').then(function () {
            var searchCriteria = [
                'SEEN'
            ];

            var fetchOptions = {
                bodies: ['HEADER', 'TEXT'],
                markSeen: false
            };

            return connection.search(searchCriteria, fetchOptions).then(function (results) {
                var emails = [];
                var body = [];
                var header = [];
                var identifier = [];

                var identifier = results.map(function (res) {
                    return res;
                })


                var header = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'HEADER';
                    })[0].body
                });

                var body = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'TEXT';
                    })[0].body
                });

                //res.send(body);
                var htmlToText = require('html-to-text');

                for (var i = 0; i < results.length; i++) {
                    var content = htmlToText.fromString(body[i]).replace(/\n/g, " ");
                    content = content.replace(/\=/g, "");

                    var data = {
                        id: header[i]['message-id'][0],
                        sender: header[i].to[0],
                        email: header[i].from[0],
                        status: identifier[i].attributes.flags[0],
                        subject: header[i].subject[0],
                        body: content,
                        timestamp: header[i].date[0]
                    }
                    emails.push(data);
                }

                res.send(emails);

            });
        });
    });
});

router.post('/sendemail', (req, res) => {


    var nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: req.body.user,
            pass: req.body.password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: req.body.user, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.text// plain text body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });


});



module.exports = router; 