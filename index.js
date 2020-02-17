const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path  = require("path"); // its a node module which deals with file paths


const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Static folder

app.use(express.static(path.join(__dirname, 'public')));

// Signup route

app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body; // all form-body data will come to these 3 variables only

    //make sure fields are filled (validation)

    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    // we will request to mailchimp api
    // Construct req data {first name and lastname comes under merge field tags rather than email}
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //now we can't send this as an object so we convert it into string using stringfy

    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us4.api.mailchimp.com/3.0/lists/1d153468e5', //dc replace with datacenter(like us4,us14,us18 etc)
        method: 'POST', // if we try it now it will give 401,as we have not applied APIs keys to authorize {without headers}
        headers: {
            Authorization: 'auth ee0304b7ea59338d68e4bf41a6d40489-us4'
        },
        body: postData
    }

    request(options, (error, response, body) => {
        if(error){
            res.redirect('/fail.html');
        }else {
            if(response.statusCode === 200){
                res.redirect('/success.html');
            }else{
                res.redirect('/fail.html');
            }
        }
    });

});

const PORT = process.env.PORT || 5000; // to deploy or run locally


app.listen(PORT, console.log('server started on ${PORT}')); // Es6 syntax

