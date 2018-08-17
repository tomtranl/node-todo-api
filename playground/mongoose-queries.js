const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user');

 let id = '5b75a6eeddbe3f640b6b3214';

User.findById(id).then((user) =>
{
    if (!user)
    {
        return console.log('Id not found');
    }
    console.log('User By Id', user);
}).catch((e) =>
{
    console.log(e);
});
