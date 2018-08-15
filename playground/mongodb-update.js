const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>
{
    if (err)
    {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Users').findOneAndUpdate({_id: new ObjectID('5b746348a4456f034099f54b')},
    {
        $set:
        {
            name: 'Murad Odeserundiye'
        },
        $inc:
        {
            age: 1
        }
    },
    {
        returnOriginal: false
    }).then((result) =>
    {
        console.log(JSON.stringify(result, undefined, 2));
    })

   
   db.close();
});
