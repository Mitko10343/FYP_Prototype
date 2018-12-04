//variables returned from api
let codeToken;
let spotifyName;
let spotify_email;
let country;
let uid;

//seting up the spotify wrapper and credentials
const Spotify = require('spotify-web-api-node');
const spotifyAPI = new Spotify({
    clientId: "4b7119c7e7f844c098893926c9347f4c",
    clientSecret: "f557fc2aff524503962cac9cf3022aa5",
    redirectUri: "http://127.0.0.1:3000/success"
});
//AuthorizeURL Variables
const scope = ["user-read-private","user-read-email"];
const state = 'code';
exports.authorizeURL = spotifyAPI.createAuthorizeURL(scope, state); //getting the authorizeUrl

exports.getUID = ()=>{
    return uid;
};
exports.getAPI = ()=>{
    return spotifyAPI;
};
exports.getClientID = () =>{
    return spotifyAPI.getClientId();
};
exports.getClientSecret = () =>{
    return spotifyAPI.getClientSecret();
};
exports.getRedirectURI = () =>{
    return spotifyAPI.getRedirectURI();
};
exports.getCode = ()=>{
    return codeToken;
};
exports.getToken = ()=>{
    return spotifyAPI.getAccessToken();
};
exports.getRToken =() =>{
    return spotifyAPI.getRefreshToken();
};
exports.getDisplayName=()=>{
    return spotifyName;
};
exports.getEmail = () =>{
    return spotify_email;
};
exports.getCountry =() =>{
    return country;
};
exports.setCode = (code)=>{
    codeToken = code;
};
exports.setToken =(token)=>{
    spotifyAPI.setAccessToken(token);
};
exports.setRToken = (r_token)=>{
    spotifyAPI.setRefreshToken(r_token);
};
exports.setDisplayName = (d_name)=>{
    spotifyName = d_name;
};
exports.setCountry = (c) =>{
    country = c;
};
exports.setEmail = (email) =>{
    spotify_email = email;
};
exports.setUID = (id)=>{
    uid = id;
};

/*
exports.getTracks = ()=>{
    spotifyAPI.getUserPlaylists(uid)
        .then((data)=>{
            //console.log(data.body);
            const playlistID = data.body.items[0].id;
            spotifyAPI.getPlaylistTracks(playlistID,{
                fields:'items',
            })
                .then((tracks) =>{
                    return new Promise((resolve,reject)=>{
                        try {
                            let songs =[];
                            tracks.body.items.forEach((track) => {
                                let song = {
                                    url: JSON.stringify(track.track.href),
                                    Id: JSON.stringify(track.track.id),
                                    name: JSON.stringify(track.track.name),
                                    number: JSON.stringify(track.track.track_number),
                                };
                                songs.push(song);
                            });
                            console.log(songs);
                            resolve(songs);
                        }catch(error){
                            reject (error);
                        }

                    })

                }).catch((error)=>{
                console.log(error)
            });
        }).catch(error =>{
        console.log(error);
    });
};*/