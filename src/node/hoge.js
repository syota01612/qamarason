const express = require('express');
const app = express();
const port = 2760;

app.get ('/',(req,res) =>{
     res.send('niceeeeeee,World!');
});

app.listen(port,() =>{
    console.log('Express app listening at http://localhost:${port}');
});