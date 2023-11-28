// const express = require('express');
// const cors = require('cors')
// const bodyParser = require("body-parser")
// const SpotifyWebApi = require('spotify-web-api-node');


// const app = express();
// app.use(cors())
// app.use(bodyParser.json())

// app.post('/refresh', (req, res) => {
//     const refreshToken = req.body.refreshToken
//     const spotifyApi = new SpotifyWebApi({
//     redirectUri: 'http://localhost:3000',
//     clientId: '4d6c7eae97cd480fb1088393ebd8f107',
//     clientSecret: '6f54d43f0d354899bb3c6fbfa44982e8',
//     refreshToken
//     })
// })

// app.post('/login', (req, res) => {
//     const code = req.body.code
//     const spotifyApi = new SpotifyWebApi({
//         redirectUri: 'http://localhost:3000',
//         clientId: '4d6c7eae97cd480fb1088393ebd8f107',
//         clientSecret: '6f54d43f0d354899bb3c6fbfa44982e8'
//     })

//     spotifyApi.authroizationCodeGrant(code).then(data =>{
//         res.json({
//             accessToken: data.body.access_token,
//             refreshToken: data.body.refresh_token,
//             expiresIn: data.body.exipres_in,
//         })
//     })
//     .catch(() => {
//         res.sendStatus(400)
//     })

// })


// app.listen(3001)
