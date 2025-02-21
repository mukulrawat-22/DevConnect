const express = require('express');

const app = express();

app.use("/test",(req , res ) => {
    res.send("hello from the server");
});
app.use("/dashboard",(req , res ) => {
    res.send("hello from the dashboard!");
});

app.use("/hello",(req , res ) => {
    res.send("hello hello hello!");
});
app.listen(3000, ()=> {
    console.log("Server is successfully listening port 3000");
});