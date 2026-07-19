const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let threadId = '';
let replyId = '';

suite('Functional Tests', function () {

  test('Creating a new thread: POST request to /api/threads/{board}', function (done) {

    chai.request(server)
      .post('/api/threads/testboard')
      .send({
        text: 'Thread de prueba',
        delete_password: '1234'
      })
      .end(function (err, res) {

        assert.equal(res.status, 200);
        done();

      });

  });

  test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function (done) {

    chai.request(server)
      .get('/api/threads/testboard')
      .end(function (err, res) {

        assert.equal(res.status, 200);
        assert.isArray(res.body);

        if (res.body.length > 0) {
          threadId = res.body[0]._id;
        }

        done();

      });

  });

  test('Deleting a thread with the incorrect password', function (done) {

    chai.request(server)
      .delete('/api/threads/testboard')
      .send({
        thread_id: threadId,
        delete_password: 'incorrecta'
      })
      .end(function (err, res) {

        assert.equal(res.text, 'incorrect password');
        done();

      });

  });

  test('Reporting a thread', function (done) {

    chai.request(server)
      .put('/api/threads/testboard')
      .send({
        thread_id: threadId
      })
      .end(function (err, res) {

        assert.equal(res.text, 'reported');
        done();

      });

  });

  test('Creating a new reply', function (done) {

    chai.request(server)
      .post('/api/replies/testboard')
      .send({
        thread_id: threadId,
        text: 'Mi respuesta',
        delete_password: '1234'
      })
      .end(function (err, res) {

        assert.equal(res.status, 200);
        done();

      });

  });

  test('Viewing a single thread with all replies', function (done) {

    chai.request(server)
      .get('/api/replies/testboard')
      .query({
        thread_id: threadId
      })
      .end(function (err, res) {

        assert.equal(res.status, 200);

        if (res.body.replies.length > 0) {
          replyId = res.body.replies[0]._id;
        }

        done();

      });

  });

  test('Deleting a reply with the incorrect password', function (done) {

    chai.request(server)
      .delete('/api/replies/testboard')
      .send({
        thread_id: threadId,
        reply_id: replyId,
        delete_password: 'incorrecta'
      })
      .end(function (err, res) {

        assert.equal(res.text, 'incorrect password');
        done();

      });

  });

  test('Reporting a reply', function (done) {

    chai.request(server)
      .put('/api/replies/testboard')
      .send({
        thread_id: threadId,
        reply_id: replyId
      })
      .end(function (err, res) {

        assert.equal(res.text, 'reported');
        done();

      });

  });

  test('Deleting a reply with the correct password', function (done) {

    chai.request(server)
      .delete('/api/replies/testboard')
      .send({
        thread_id: threadId,
        reply_id: replyId,
        delete_password: '1234'
      })
      .end(function (err, res) {

        assert.equal(res.text, 'success');
        done();

      });

  });

  test('Deleting a thread with the correct password', function (done) {

    chai.request(server)
      .delete('/api/threads/testboard')
      .send({
        thread_id: threadId,
        delete_password: '1234'
      })
      .end(function (err, res) {

        assert.equal(res.text, 'success');
        done();

      });

  });

});