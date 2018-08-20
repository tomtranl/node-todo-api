const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todos');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) =>
{
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then( (doc) =>
    {
        res.send(doc);
    }, (e) =>
    {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) =>
{
    Todo.find().then( (todos) =>
    {
        res.send({todos});
    }, (e) =>
    {
        res.status(400).send(e);
    })
});

// GET /todos/1234324
app.get('/todos/:id', (req, res) =>
{
    let id = req.params.id;

    // Validate id using isValid
        // 404 - send back empty send
        if (!ObjectID.isValid(id))
        {
            return res.status(404).send();
        }
        Todo.findById(id).then((todo) =>
        {
            if (!todo)
            {
                return res.status(404).send();
            }
                res.send({todo});
        }).catch((e) =>
        {
            res.status(400).send();
        })
    
});

app.delete('/todos/:id', (req, res) =>
{
    let id = req.params.id;
   
    if (!ObjectID.isValid(id))
    {
        return res.status(404).send('Not a valid id');
    }
    Todo.findByIdAndRemove(id).then((doc) =>
    {
        if (!doc)
        {
            return res.status(404).send('Cannot find id');
        }
        return res.status(200).send(JSON.stringify(doc, undefined, 2));
    }).catch((e) =>
    {
        res.status(400).send('Bad request');
    });
});

app.patch('/todos/:id', (req, res) =>
{
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id))
    {
        return res.status(404).send('Not a valid id');
    }

    if (_.isBoolean(body.completed) && body.completed)
    {
        body.completedAt = new Date().getTime();
    }
    else
    {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then ((todo) =>
    {   
        if(!todo)
        {
            return res.status(404).send('Cannot find id');
        }
        res.send({todo});
    }).catch((e) =>
    {
        res.status(400).send();
    })

});


// POST /users using pick
app.post('/users', (req, res) =>
{
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
  
    user.save().then(() =>
    {
       return user.generateAuthToken();
    }).then((token) =>
    {
       
    }).catch((e) =>
    {
        res.status(400).send(e);
    })
});


app.get('/users/me', authenticate,(req, res) =>
{
   res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) =>
{
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) =>
    {
        user.generateAuthToken().then((token) =>
        {   
            res.header('x-auth', token).send(user);
        });  
    }).catch((e) =>
    {
        res.status(400).send();
    });
});


app.listen(port, () =>
{
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
