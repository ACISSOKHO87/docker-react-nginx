const express = require('express');
const { MongoClient } = require('mongodb');
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
let count;
const mongoUrl = process.env.NODE_ENV === 'production' ?
`mongodb://${ process.env.MONGO_USERNAME }:${ process.env.MONGO_PWD }@db` :
`mongodb://db`;

const client = new MongoClient(mongoUrl); 
async function run() { 
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('CONNEXION DB OK !');
    count = client.db('test').collection('count');
    if ((await count.countDocuments()) === 0) {
        count.insertOne({ count: 0 });
    }
  } catch (err) {
    console.log(err.stack);
  }
}
run().catch(console.dir);


const app = express();

app.get('/api/count', (req, res) => {
  count.findOneAndUpdate({}, { $inc: { count: 1 } }, { returnNewDocument: true, upsert: true }).then((doc) => {
    res.status(200).json(doc ? doc.count : 0);
  })
})

app.all('*', (req, res) => {  
  res.status(404).end();
})

const server = app.listen(80);

// signals : 'SIGINT', 'SIGTERM', 'SIGQUIT']
// Graceful shutdown.
//On empêche les nouvelles connexions sur le serveur
//Ensuite on close proprement la connexion DB

signals.forEach(signal => process.on('SIGINT', () => {
    server.close((err) => {
        if (err) {
            process.exit(1);
        } else {
            if (client) {
                client.close((err) => {
                process.exit(err ? 1 : 0); 
            });
            } else {
                process.exit(0);
            }
        } 
    });
}))
