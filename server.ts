import express from 'express';

const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = 3001

const dummyUsers = [
    {
        id: 1,
        username: "alice",
        password: "pw1"
    },
    {
        id: 2,
        username: "bob",
        password: "pw2"
    },
]

app.get('/', (req,res) => {
    // res.send("Loginsuccessful")
    res.send("Yes server is working")
})


// CUREL REQUEST TO TEST

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = dummyUsers.find(user => user.username === username && user.password === password)
    
    // more verbose version of the same code
    // function checkUserMatches(user) {
    // return user.username === username && user.password === password
    // }


    console.log("username", username)
    console.log("password", password)

    res.send("Yes the /post endpoint says hello")
})


app.listen( port, () => {
    console.log(`Example app listening on port${port} `)
}
)