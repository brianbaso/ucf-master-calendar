const assert = require('assert');
const Supertest = require('supertest');
const supertest = Supertest('https://us-central1-ucf-master-calendar.cloudfunctions.net/webApi');

describe('Club Tests', () => {

  it('getClub: should return a club', async () => {
    await supertest
      .get('/api/v1/clubs/aPCdWbGu2fDMdoqhRMET')
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });

  it('getClubs: should return all clubs', async () => {
    await supertest
      .get('/api/v1/clubs/')
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });

  it('createClub: should create a club', async () => {
    await supertest
      .post('/api/v1/clubs/')
      .send({
                "description": "Test create club",
                "other": "Section for any additional information",
                "website": "knighthacks.org",
                "instagram": "instagram.com/knighthacks",
                "twitter": "twitter.com/knighthacks",
                "meetingInfo": "Thursdays @ 7:30PM. Meeting locations vary, check the events for more information.",
                "userId": "ztPF0O6kQ4capBzTDwMZ",
                "name": "Knight Hackz 2",
                "email": "team@knighthacks.org",
                "facebook": "facebook.com/knighthacks",
                "coverImage": "https://jaxbot.me/pics/knighthacks-atrium.jpg"
      })
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });

  it('updateClub: should update a club', async () => {
    await supertest
      .put('/api/v1/clubs/Ll9pl7LLugJtcff78wxd')
      .send({
                "description": "Update create club",
                "other": "Section for any additional information",
                "website": "knighthacks.org",
                "instagram": "instagram.com/knighthacks",
                "twitter": "twitter.com/knighthacks",
                "meetingInfo": "Thursdays @ 7:30PM. Meeting locations vary, check the events for more information.",
                "userId": "ztPF0O6kQ4capBzTDwMZ",
                "name": "Knight Hackz 2",
                "email": "team@knighthacks.org",
                "facebook": "facebook.com/knighthacks",
                "coverImage": "https://jaxbot.me/pics/knighthacks-atrium.jpg"
      })
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });
});

describe('Event Tests', () => {

  it('getEvent: should return an event', async () => {
    await supertest
      .get('/api/v1/events/etBts3B8eUF7AKxb6UzY')
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });

  it('getEvents: should return all events', async () => {
    await supertest
      .get('/api/v1/events/')
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });

  it('createEvent: should create an event', async () => {
    await supertest
      .post('/api/v1/events/')
      .send({
              "startTime": {
                          "_seconds": 1605618000,
                          "_nanoseconds": 0
                      },
                      "description": "Test create event",
                      "userId": "9m2eH20kHaMAOHF0VzcW",
                      "clubId": "I3qJRDx9gBXOHOF3SDM8",
                      "location": "dank 420",
                      "endTime": {
                          "_seconds": 1605620100,
                          "_nanoseconds": 0
                      },
                      "title": "Test create event"
          })
      .expect(200)
      .expect((response) => {
        assert.ok(typeof JSON.parse(response.text) === 'object')
      });
  });
});
