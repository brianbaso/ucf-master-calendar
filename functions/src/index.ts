import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

let cors_options =
{
  "origin": "*",
  "methods": "*",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

const cors = require('cors')(cors_options);

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
app.use(cors);
app.options('*', cors);

export const webApi = functions.https.onRequest(main);

// *** Routes for 'club' ***
// Create a club
app.post('/clubs', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {

    // Get the club info from the request body
    const { name, coverImage, description, meetingInfo, website,
            instagram, facebook, twitter, email, other, userId } = request.body;

    const data = { name, coverImage, description, meetingInfo, website,
              instagram, facebook, twitter, email, other, userId }

    // Create a new collection in the firestore db if needed, otherwise add to
    // the existing colleciton
    const clubRef = await db.collection('clubs').add(data);
    const club = await clubRef.get();

    // Show what the response will be
    response.json({
      id: clubRef.id,
      data: club.data()
    });

  } catch(e) {
    response.status(500).send(e);
  }
});

// Get all clubs
app.get('/clubs', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {

    // create a snapshot of the firestore db
    const clubsQuerySnapshot = await db.collection('clubs').get();

    // create an array for the clubs to go into
    const clubs:any[] = [];

    // grab every club in the collection
    clubsQuerySnapshot.forEach((doc) => {
        clubs.push({
          id: doc.id,
          data: doc.data()
        });
      }
    );

    // return the array of clubs to the client
    response.json(clubs);

  } catch(e) {
    response.status(500).send(e);
  }
});

// Get a club
app.get('/clubs/:club', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {
    // grab the id from the http request
    const clubId = request.params.club;

    if (!clubId) throw new Error('Club ID is required');

    // reference the club in the clubs collection and set it to a const
    const club = await db.collection('clubs').doc(clubId).get();

    if (!club.exists) {
      throw new Error ('Club does not exist');
    }

    // return the club to the client
    response.json({
      id: club.id,
      data: club.data()
    });

  } catch(e) {
    response.status(500).send(e);
  }
});

// Update a club
app.put('/clubs/:club', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {

    // get the club id from the request param
    const clubId = request.params.club;

    if (!clubId) throw new Error('Club ID is required');

    // Get the club info from the request body
    const { name, coverImage, description, meetingInfo, website,
            instagram, facebook, twitter, email, other, userId } = request.body;

    // create the object to send to in the request to the server
    const data = { name, coverImage, description, meetingInfo, website,
              instagram, facebook, twitter, email, other, userId }

    // reference the document in the nosql database so that you can update it
    await db.collection('clubs').doc(clubId).set(data, { merge: true });

    // return the confirmation that the document changed
    response.json({
      id: clubId,
      data
    });

  } catch(e) {
    response.status(500).send(e);
  }
});

// Delete a club
app.delete('/clubs/:club', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {
    // Grab the club id from the url
    const clubId = request.params.club;

    if (!clubId) throw new Error('ID is required');

    // delete the document out of the clubs collection
    await db.collection('clubs').doc(clubId).delete();

    // delete confirmation response
    response.json({
      id: clubId
    });

  } catch(e) {
    response.status(500).send(e);
  }
});


// *** Routes for 'event' ***
// Create an event
app.post('/events', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {

    // Get the event info from the request body
    const { title, description, startTime, endTime, location, userId, clubId } = request.body;

    const data = { title, description, startTime, endTime, location, userId, clubId };

    // Create a new collection in the firestore db if needed, otherwise add to
    // the existing colleciton
    const eventRef = await db.collection('events').add(data);
    const event = await eventRef.get();

    // Show what the response will be
    response.json({
      id: eventRef.id,
      data: event.data()
    });

  } catch(e) {
    response.status(500).send(e);
  }
});

// Get an event
app.get('/events/:event', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {
    // grab the id from the http request
    const eventId = request.params.event;

    if (!eventId) throw new Error('Event ID is required');

    // reference the club in the clubs collection and set it to a const
    const event = await db.collection('events').doc(eventId).get();

    if (!event.exists) {
      throw new Error ('Event does not exist');
    }

    // return the club to the client
    response.json({
      id: event.id,
      data: event.data()
    });

  } catch(e) {
    response.status(500).send(e);
  }
});

// Get all events
app.get('/events', async (request, response) => {

  response.set('Access-Control-Allow-Origin', '*');

  try {

    // create a snapshot of the firestore db
    const eventsQuerySnapshot = await db.collection('events').get();

    // create an array for the events to go into
    const events:any[] = [];

    // grab every event in the collection
    eventsQuerySnapshot.forEach((doc) => {
        events.push({
          id: doc.id,
          data: doc.data()
        });
      }
    );

    // return the array of events to the client
    response.json(events);

  } catch(e) {
    response.status(500).send(e);
  }
});

// Update an event
app.put('/events/:event', async (request, response) => {

  response.set('Access-Control-Allow-Origin', '*');

  try {

    // get the club id from the request param
    const eventId = request.params.event;

    if (!eventId) throw new Error('Event ID is required');

    // Get the event info from the request body
    const { title, description, startTime, endTime, location, clubId, userId } = request.body;

    const data = { title, description, startTime, endTime, location, userId, clubId }

    // reference the document in the nosql database so that you can update it
    await db.collection('events').doc(eventId).set(data, { merge: true });

    // return the confirmation that the document changed
    response.json({
      id: eventId,
      data
    });

  } catch(e) {
    response.status(500).send(e);
  }
});

// Delete an event
app.delete('/events/:event', async (request, response) => {

  response.set('Access-Control-Allow-Origin', '*');

  try {
    // Grab the club id from the url
    const eventId = request.params.event;

    if (!eventId) throw new Error('Event ID is required');

    // delete the document out of the clubs collection
    await db.collection('events').doc(eventId).delete();

    // delete confirmation response
    response.json({
      id: eventId
    });

  } catch(e) {
    response.status(500).send(e);
  }
});
