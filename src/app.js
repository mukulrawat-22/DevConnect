const express = require('express');

const app = express();

// app.use("/test",(req , res ) => {
//     res.send("hello from the server");
// });
// app.use("/dashboard",(req , res ) => {
//     res.send("hello from the dashboard!");
// });

// app.use("/hello/2",(req , res ) => {
//     res.send("hello dhinchak pooja");
// });
// app.use("/hello",(req , res ) => {
//     res.send("hello hello hello!");
// });

app.get("/user",(req , res ) => {
    res.send({firstName : "mukul", lastName : "Rawat"});
})

app.post("/user",(req , res ) => {
    res.send("User created successfully!");
})

app.delete("/user",(req , res ) => {
    res.send("User deleted successfully!");
})

app.use("/",(req , res ) => {
    res.send("hello from the dashboard!");
});
app.listen(3000, ()=> {
    console.log("Server is successfully listening port 3000");
});