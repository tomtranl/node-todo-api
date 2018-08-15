const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>
{
    if (err)
    {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Users').deleteMany({name: 'Tom Tran'}).then((result) =>
    // {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: 123}).then((result) =>
    {
        console.log(JSON.stringify(result, undefined, 2));
    })

});

// deleteMAny, findOneDelete by id(Mike)
// deleteMany same name