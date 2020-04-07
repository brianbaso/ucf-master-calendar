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
app.post('/users/:user/clubs', async (request, response) => {
  try {

    const userId = request.params.user;
    if (!userId) throw new Error('User ID is required');

    // Get the club info from the request body
    const { name, coverImage, description, meetingInfo, website,
            instagram, facebook, twitter, email, other } = request.body;

    const data = { name, coverImage, description, meetingInfo, website,
              instagram, facebook, twitter, email, other }

    // Create a new collection in the firestore db if needed, otherwise add to
    // the existing colleciton
    const clubRef = await db.collection('users').doc(userId).collection('clubs').add(data);
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
app.get('/users/:user/clubs', async (request, response) => {
  try {

    const userId = request.params.user;
    if (!userId) throw new Error('User ID is required');

    // create a snapshot of the firestore db
    const clubsQuerySnapshot = await db.collection('users').doc(userId).collection('clubs').get();

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

// Update a club
app.put('/users/:user/clubs/:club', async (request, response) => {
  try {

    // get the club id from the request param
    const clubId = request.params.club;
    const userId = request.params.user;

    if (!clubId) throw new Error('Club ID is required');
    if (!userId) throw new Error('User ID is required');

    // Get the club info from the request body
    const { name, coverImage, description, meetingInfo, website,
            instagram, facebook, twitter, email, other } = request.body;

    // create the object to send to in the request to the server
    const data = { name, coverImage, description, meetingInfo, website,
              instagram, facebook, twitter, email, other }

    // reference the document in the nosql database so that you can update it
    await db.collection('users').doc(userId).collection('clubs').doc(clubId).set(data, { merge: true });

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
app.delete('/users/:user/clubs/:club', async (request, response) => {
  try {
    // Grab the club id from the url
    const clubId = request.params.club;
    const userId = request.params.user;

    if (!clubId) throw new Error('ID is required');
    if (!userId) throw new Error('User ID is required');

    // delete the document out of the clubs collection
    await db.collection('users').doc(userId).collection('clubs').doc(clubId).delete();

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
app.post('/users/:user/clubs/:club/events', async (request, response) => {
  try {

    const userId = request.params.user;
    const clubId = request.params.club;

    if (!userId) throw new Error('User ID is required');
    if (!clubId) throw new Error('Club ID is required');

    // Get the event info from the request body
    const { title, description, startTime, endTime, location } = request.body;

    const data = { title, description, startTime, endTime, location }

    // Create a new collection in the firestore db if needed, otherwise add to
    // the existing colleciton
    const eventRef = await db.collection('users').doc(userId).collection('clubs').doc(clubID).collection('events').add(data);
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
app.get('/users/:user/clubs/:club/events/:event', async (request, response) => {
  try {
    // grab the id from the http request
    const eventId = request.params.event;
    const clubId = request.params.club;
    const userId = request.params.user;

    if (!clubId) throw new Error('Club ID is required');
    if (!eventId) throw new Error('Event ID is required');
    if (!userId) throw new Error('User ID is required');

    // reference the club in the clubs collection and set it to a const
    const event = await db.collection('users').doc(userId).collection('clubs').doc(clubId).collection('events').doc(eventId).get();

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
app.get('/users/:user/clubs/:club/events', async (request, response) => {
  try {

    const clubId = request.params.club;
    const userId = request.params.user;

    if (!clubId) throw new Error('Club ID is required');
    if (!userId) throw new Error('User ID is required');

    // create a snapshot of the firestore db
    const eventsQuerySnapshot = await db.collection('users').doc(userId).collection('clubs').doc(clubId).collection('events').get();

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
})

// Update an event
app.put('/users/:user/clubs/:club/event/:event', async (request, response) => {
  try {

    // get the club id from the request param
    const clubId = request.params.club;
    const userId = request.params.user;
    const eventId = request.params.event;

    if (!clubId) throw new Error('Club ID is required');
    if (!userId) throw new Error('User ID is required');
    if (!eventId) throw new Error('Event ID is required');

    // Get the event info from the request body
    const { title, description, startTime, endTime, location } = request.body;

    const data = { title, description, startTime, endTime, location }

    // reference the document in the nosql database so that you can update it
    await db.collection('users').doc(userId).collection('clubs').doc(clubId).collection('events').doc(eventId).set(data, { merge: true });

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
app.delete('/users/:user/clubs/:club/events/:event', async (request, response) => {
  try {
    // Grab the club id from the url
    const clubId = request.params.club;
    const userId = request.params.user;
    const eventId = request.params.event;

    if (!clubId) throw new Error('ID is required');
    if (!userId) throw new Error('User ID is required');
    if (!eventId) throw new Error('Event ID is required');

    // delete the document out of the clubs collection
    await db.collection('users').doc(userId).collection('clubs').doc(clubId).collection('events').doc(eventId).delete();

    // delete confirmation response
    response.json({
      id: eventId
    });

  } catch(e) {
    response.status(500).send(e);
  }
});
