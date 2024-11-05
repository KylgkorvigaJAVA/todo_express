const express = require('express')
const app = express()
const fs = require('fs');

const path = require('path')

app.use(express.urlencoded({ extended: true} ));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if(err) {
                console.error(err);
                return;
            }
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    })
}

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf-8', err => {
            if(err) {
                console.error(err);
                return;
            }
            resolve(true)
        });
    })
}

app.get('/', (req, res) => {
    readFile('./tasks.json')
        .then(tasks => { 
            res.render('index', {
                tasks: tasks,
                error: null
        }) 
    })
})

app.post('/', (req, res) => {
    let error = null
    if(req.body.task.trim().length == 0) {
    error = 'Insert correct task data'
    console.log(error)
    readFile('./tasks.json')
        .then(tasks => {
            res.render('index', {
                tasks: tasks, 
                error: error
        })
    })
} else {
    readFile('./tasks.json')
    .then(tasks => {
    let index
        if(tasks.length === 0) {
            index = 0
        } else {
            index = tasks[tasks.length - 1].id +1;
        }
        const newTask = {
            "id" : index,
            "task" : req.body.task
        }
        tasks.push(newTask)
        data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
        res.redirect('/')
        })
    }
})

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId) {
                tasks.splice(index, 1)
            }
        })
        data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
        res.redirect('/')
    })
})

app.get('/delete-all', (req, res) => {
    tasks = []
    const data = JSON.stringify(tasks, null, 2)
    writeFile('./tasks.json', data)
    res.redirect('/')
})

app.get('/update-task/:taskId', (req, res) => {
    let updateTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        let updateTask
        tasks.forEach((task) => {
            if(task.id === updateTaskId) {
                updateTask = task.task
            }
        })
        res.render('update', {
            updateTaskId: updateTaskId,
            updateTask: updateTask,
            error: null
        })
    })
})

app.post('/update-task', (req, res) => {
    console.log(req.body)
    let updateTaskId = parseInt(req.body.taskId)
    let updateTask = req.body.task
    let error = null
    if(updateTask.trim().length == 0) {
        error = 'Insert correct task data'
        console.log(error)
        res.render('update', {
            updateTaskId: updateTaskId,
            updateTask: updateTask,
            error: error
        })
    } else {
        readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === updateTaskId) {
                    tasks[index].task = updateTask
                }
            });
            console.log(tasks)
            const data = JSON.stringify(tasks, null, 2)
            writeFile('./tasks.json', data)
            res.redirect('/')
        })
    }
})        

app.listen(3001, () => {
    console.log('Server is started @ http://localhost:3001')
})