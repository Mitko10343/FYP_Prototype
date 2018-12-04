const request = require("request");
const express = require('express');
const querystring = require('querystring');
const router = express.Router();
//Body Parser
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const spotifyProfie = require('../scripts/spotify');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index',{title:"hello"});
});

router.get('/loginSpotify', (req, res) => {
    if(spotifyProfie.getToken() === undefined) {
        res.redirect(spotifyProfie.authorizeURL);
    }else{
        res.redirect("/profile");
    }
});

router.get('/success', urlEncodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    spotifyProfie.setCode(req.query.code);
    let authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: spotifyProfie.getCode(),
            redirect_uri: spotifyProfie.getRedirectURI(),
            grant_type: "authorization_code"
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(spotifyProfie.getClientID()+ ':' + spotifyProfie.getClientSecret()).toString('base64'))
        },
        json: true
    };
    request.post(authOptions, (error, response, body) => {
        spotifyProfie.setToken(body.access_token);
        spotifyProfie.setRToken(body.refresh_token);

        const options  = {
            url : "https://api.spotify.com/v1/me",
            headers:{'Authorization' : `Bearer ${spotifyProfie.getToken()}`},
            json:true
        };
        request.get(options,(error,response,b)=> {
            spotifyProfie.setUID(b.id);
            spotifyProfie.setDisplayName(b.display_name);
            spotifyProfie.setCountry(b.country);
            spotifyProfie.setEmail(b.email);
            res.redirect('/profile');
        });
    });
});

router.get('/profile',(req,res)=>{
    const info = {
            name : spotifyProfie.getDisplayName(),
            email : spotifyProfie.getEmail(),
            country : spotifyProfie.getCountry(),
            token : spotifyProfie.getToken(),
            r_token : spotifyProfie.getRToken()
        };
    res.render('login',{info:info});
});

router.get('/getSongs',(req,res)=>{
   const spotifyAPI = spotifyProfie.getAPI();
   spotifyAPI.getUserPlaylists(spotifyProfie.getUID())
       .then((data)=>{
           //console.log(data.body);
           const playlistID = data.body.items[0].id;
           spotifyAPI.getPlaylistTracks(playlistID,{
               fields:'items',
           })
           .then((tracks) =>{
               let songs =[];
               tracks.body.items.forEach((track) =>{
                   let song = {
                       url: JSON.stringify(track.track.href),
                       Id : JSON.stringify(track.track.id) ,
                       name: JSON.stringify(track.track.name),
                       number: JSON.stringify(track.track.track_number),
                   };
                   songs.push(song);
               });
               console.log(songs);
               res.render('songList', {
                   songs : songs,
               })
           }).catch((error)=>{
               console.log(error)
           });
       }).catch(error =>{
           console.log(error);
   });
   /*spotifyProfie.getTracks().then(songs=> {
       console.log("Back HEre");
       console.log(`songs ${JSON.stringify(songs)}`);
       res.render('songList', {
           songs:songs
       });
   }).catch(error =>{
       console.log(error);
   })*/
});

router.get('/register',(req,res) =>{
    res.render('register');
});

const admin = require("firebase-admin");
const serviceAccount = require("../serviceKey/serviceKey");

//Login and register using firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://prototype-7eefd.firebaseio.com"
});
const db = admin.firestore();
router.post("/registers",(req,res)=>{
    console.log(req.body);
    const email = req.body.email;
    const displayName = req.body.displayName;
    const pwd = req.body.pwd;

    admin.auth().createUser({
        email : email,
        password : pwd,
        displayName :displayName,
        accountType : "regular"
    }).then((userRecord) =>{
        db.collection("users").doc(userRecord.uid).set({
            display_name: displayName,
            email: email,
            password: pwd
        }).then(()=>{
            console.log(`Successfully added user : ${userRecord.displayName} User Id: ${userRecord.uid}`);
            res.render('index',{title:userRecord.displayName});
        }).catch(error => {
            res.render('index',{title:error.message});
        });
    }).catch(error =>{
        res.render('index',{title:error.message});
    });
});
router.post("/login",(req,res)=>{
    const email = req.body.email;
    const pwd = req.body.password;
    const displayName= req.body.displayName;
    admin.auth().getUserByEmail(email)
    .then(user => {
        console.log(user.uid);
        if(user.password === pwd){
            res.render("index",{title:user.displayName});
        }else{
            console.log("wrong password");
            res.render('register');
        }
    }).catch(error=>{
        res.render('index',{title:error.message});
    })
});

module.exports = router;
