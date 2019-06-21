const server = require('express');
const neDB = require('nedb');

const app = server();
const database = new neDB('server-db.db')
//begin to load database from previous time ran into memory
//if the server haven't run or create the file, it would create then
database.loadDatabase();


//setup middleware
app.use(server.static('client'));
//because the fetch request is using 'POST' and sentwrapped into JSON
//so the express need a middleware that increase the ability of server to parse data that wrapped into JSON
app.use(server.json({
    limit: '1mb'
}));

//routing the request
app.post('/api', (request, response) => {
    console.log(request.body);

    const data = request.body;
    //add more property objects to stored on database
    const timestamp = Date.now();
    data.timestamp = timestamp;

    if (data.lat == null || data.lon == null) {
        response.json({
            status: 'Server doesn\'t get your location',
            timestamp: timestamp,
            latitude: null,
            longitude: null
        });
    } else {
        //save into database
        database.insert(data);

        //send respond back to client as a flag
        //and wrapped into JSON
        response.json({
            status: 'Server get your location!',
            timestamp: timestamp,
            latitude: data.lat,
            longitude: data.lon
        });
    }
})

app.listen(3000, () => {
    console.log(`Server is listening at port 3000`);
})