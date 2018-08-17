const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user');

// Todo.remove({}).then( (result) =>
// {
//     console.log(result);
// });

//Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '5b76f57e30e96a13bbe3f204'}).then ((todo) =>
{

});
