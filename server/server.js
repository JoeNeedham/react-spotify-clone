const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: '5b424dc8c2424b40bde1bdcaef91e45b',
        clientSecret: '6bc2c03d92e54345a940d0ac5fc844f9',
        refreshToken
    })

    spotifyWebApi.refreshAccessToken().then(
        (data) => {
            console.log(data.body);
            // Save the access token so that it's used in future calls
            spotifyWebApi.setAccessToken(data.body['access_token']);
        }). catch(() => {
            res.sendStatus(400)
        })
})


app.post('/login', (req,res) => {
    const code = req.body.code
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '5b424dc8c2424b40bde1bdcaef91e45b',
        clientSecret: '6bc2c03d92e54345a940d0ac5fc844f9',
    })
    spotifyWebApi.authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(3001) // running server on port 3001