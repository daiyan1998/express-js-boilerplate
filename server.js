import dotenv from 'dotenv'
dotenv.config()
import express from 'express'


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, (error) => {
    if(!error) {
        console.log(`Server is running on port ${port}`)
    } else {
        console.log("Error occured, Server can't start",error)
    }

})