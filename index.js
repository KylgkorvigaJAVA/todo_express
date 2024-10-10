const express = require('express')
const app = express()
const fs = require('fs');

const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    fs.readFile('./tasks', 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        
        const tasks = data.split('\n')
        res.render('index', {tasks: tasks})
    });
    /* const tasks = ['Study HTML', 'Study CSS', 'Study JS', 'Study Node.js']
    res.render('index', {tasks: tasks}) */
})

app.listen(3001, () => {
    console.log('Server is started @ http://localhost:3001')
})