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
    res.sendFile(__dirname+'/services/login.html');
})


app.get('/login', (req,res) => {
    res.sendFile(__dirname+'/services/login.html');

})


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    function checkUserMatches(user) {
    return (user.username === username && user.password === password)
    }

    // // Lots of alternative ways to handle this syntax
    // const checkUserMatches2 = user => user.username === username && user.password === password
    // const checkUserMatches3 = (user) => {
    //     return user.username === username && user.password === password
    //     }
    // console.log(checkUserMatches == checkUserMatches2 == checkUserMatches3)

    const matchingUser = dummyUsers.find(checkUserMatches)
    // array.find(function) goes through an array and checks each object in the array against the function
    // it returns the first object that returns a true value for the 
    


    console.log("username", username)
    console.log("password", password)
    console.log("Details of authenticating users:", matchingUser)

    if (matchingUser) {
        res.send(`${matchingUser.username} is now welcome to login"`)
    }
    else {
        res.send("Authentication failed")
    }
})


app.listen( port, () => {
    console.log(`Example app listening on port${port} `)
}
)