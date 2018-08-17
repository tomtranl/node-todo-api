let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todos');
let {User} = require('./models/user');
let {ObjectID} = require('mongodb');

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
    console.log(id);
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

app.listen(3000, () =>
{
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
