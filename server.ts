import express, { Request } from 'express';
import client from './client'; 

const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')

const secretToken = "bigsecrettoken"
const port = 3002

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

function isAuthed(req: Request) {
    if (req.cookies.token == secretToken) {
        return true
    }
    else return false
}


async function login(username: string, password: string) {
    const userData = await client.webuser.findUnique({
        where: {
            username: username
        },
        select: {
            id: true,
            password: true,
        }
    })

    let loginSuccess = false
    if (!userData) {
        console.log("Username not found");
        loginSuccess = false
    }
    else if (password != userData.password) {
        console.log("Login failed for user ", userData.id)
        console.log("Password does not match")
        loginSuccess = false
    }
    else if (password === userData.password) {
        console.log("Login succeeded for user ", userData.id)
        loginSuccess = true
    }

    if (loginSuccess) {
        const newUserToken = Math.random().toString(36).substring(2)
        // .random gives a number like 0.28371912
        //  .toString turns it into a 0.2aua5uho13a
        // substring cuts out the 0. part and just leaves 2aua5uho13a
        console.log(newUserToken)

        return true
    }

    else return false

    // currently this returns a true or false
    // ultimately this should return a user object with sessionid, and set the cookie
}

async function checkUsername(username: string) {
    const userData = await client.webuser.findUnique({
        where: {
            username: username
        },
        select: {
            id: true,
        }
    })
    
    if (userData) return true
    else return false
}

app.get('/', (req,res) => {
    res.redirect("/login")
})

app.get('/login', (req,res) => {
    // Check if there is an authenticated cookie already there
    // if Yes - send them direct to /dashboard
    if (req.cookies.token == secretToken) return res.redirect("/dashboard");

    // if No - show login form
    else res.sendFile(__dirname+'/static/login.html');
})


app.get('/dashboard', (req,res) => {

    if (req.cookies.token == secretToken) return res.sendFile(__dirname+'/static/dashboard.html');

    else res.redirect("/login")

})

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //sample values ... jim:jimjim

    const loginAttempt = await login(username, password)

    if (loginAttempt) {

        console.log(`${username} is now logged in and will be redirected /dashboard`)
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


app.get ('/signup', async (req, res) => {
    if (req.cookies.token == secretToken) return res.redirect("/dashboard");
    else res.sendFile(__dirname+'/static/signup.html')
}
)


app.post ('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const usernameTaken = await checkUsername(username)

    if(usernameTaken) {
        console.log("Username taken.")
        res.redirect("/login")
    }

    else {
        const newEntry = await client.webuser.create({
            data : {
                username: username,
                password: password
            }
        })
        console.log("Account created for", newEntry.username)
    
        if (newEntry.id) {
            res.
                writeHead(200, {
                    "Set-Cookie": `token=${secretToken}; HttpOnly`,
                    "Access-Control-Allow-Credentials": "true",
                })
                .redirect("/dashboard")
        }
        else res.redirect("/signup")
    }

})


app.post ('/logout', (req, res) => {
    console.log("Logout route hit")
    res.
        writeHead(200, {
            "Set-Cookie": `token=null; HttpOnly`,
            "Access-Control-Allow-Credentials": "true",
        })
        .redirect("/login")
})

app.listen( port, () => {
    console.log(`Express server now listening on port ${port} `)
}
)