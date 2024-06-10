import express, { Request } from 'express';

const cookieParser = require("cookie-parser")

const bodyParser = require('body-parser')

function isAuthed(req: Request) {
    if (req.cookies.token == secretToken) {
        return true
    }
    else return false
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

const secretToken = "whigfieldisgreat"


app.get('/', (req,res) => {
    res.redirect("/login")
})


app.get('/login', (req,res) => {
    
    // get cookies from req
    // check is is the authenticated cookie already there
    // if Yes - send them direct to /dashboard

    if (req.cookies.token == secretToken) return res.redirect("/dashboard");

    // if No - show login form

    else res.sendFile(__dirname+'/static/login.html');

})



app.get('/dashboard', (req,res) => {

    if (req.cookies.token == secretToken) return res.sendFile(__dirname+'/static/dashboard.html');

    else res.redirect("/login")

})

app.post('/login', (req, res) => {

    // ADD IN HERE if Succes - update cookie <- this is in app.post

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

        console.log(`${matchingUser.username} is now logged in and will be redirected /dashboard`)
        res.
            writeHead(200, {
                "Set-Cookie": `token=${secretToken}; HttpOnly`,
                "Access-Control-Allow-Credentials": "true",
            })
            // ALT CODE
            // .cookie('userId), user.id, { httpOnly: true } )
            .redirect("/dashboard")
    }
    else {
        res.send("Authentication failed")
    }
})


app.listen( port, () => {
    console.log(`Express server now listening on port ${port} `)
}
)