import express, { Request } from 'express';
import client from './client'; 

const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')

const port = 3002

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

async function isAuthed(req: Request) {
    console.log("isAuthed has been called...")
    const userSessionDetails = await client.webuser.findUnique({
        where: {
            currentSessionToken: req.cookies.token
        },
        select: {
            id: true,
            currentSessionToken: true,
        }
    });

    console.log("attempt to retrieve token gives:", userSessionDetails)
    if(userSessionDetails){
        console.log("...and responded with True.")
        return true
    }
    else {
        console.log("...and responded with False.")
        return false
    }
}


async function login(username: string, password: string, res) {
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
        res.redirect("/login")
    }
    else if (password != userData.password) {
        console.log("Login failed for user ", userData.id)
        console.log("Password does not match")
        res.redirect("/login")
    }
    else if (password === userData.password) {
        console.log("Login succeeded for user ", userData.id)

        // LOGIN SUCCESS

        const newUserToken = Math.random().toString(36).substring(2)
        // .random gives a number like 0.28371912
        //  .toString turns it into a 0.2aua5uho13a
        // substring cuts out the 0. part and just leaves 2aua5uho13a
        console.log(newUserToken)

        const newEntry = await client.webuser.update({
            where: {
                id: userData.id
            },
            data: {
                currentSessionToken: newUserToken
            },
        }
        )
        console.log(`${username} is now logged in and will be redirected /dashboard`);
        res.cookie('token', newUserToken).redirect("/dashboard")
    }

    else return false
}

async function usernameTaken(username: string) {
    // This only checks if a username is available, used for account sign up
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


// EXPRESS ROUTES START HERE //

app.get('/', (req,res) => {
    res.redirect("/login")
})


app.get('/dashboard', async (req,res) => {
    if (await isAuthed(req)) {
        return res.sendFile(__dirname+'/static/dashboard.html');
    }
    else res.redirect("/login")
})


app.get('/login', async (req,res) => {
    if (await isAuthed(req)) {
        return res.redirect("/dashboard");
        }
        
    // if No - show login form
    else res.sendFile(__dirname+'/static/login.html');
})


app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //sample values ... jim:jimjim

    const loginAttempt = await login(username, password, res)
})


app.get ('/signup', async (req, res) => {
    if (await isAuthed(req)) {
        return res.redirect("/dashboard");
    }
    else res.sendFile(__dirname+'/static/signup.html')
}
)


app.post ('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const isTaken = await usernameTaken(username)

    if(isTaken) {
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

        login(username, password, res)
    }
})


app.post ('/logout', (req, res) => {
    console.log("Logout route hit")
    res.cookie('token', 0).redirect("/dashboard")
})

app.listen( port, () => {
    console.log(`Express server now listening on port ${port} `)
}
)