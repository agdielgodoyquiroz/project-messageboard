'use strict';

const Thread = require("../models/Thread");

module.exports = function (app) {

  app.route("/api/threads/:board")

    // Crear Thread
    .post(async (req, res) => {

      try {

        const { text, delete_password } = req.body;
        const board = req.params.board;

        const thread = new Thread({
          board,
          text,
          delete_password
        });

        await thread.save();

        res.redirect("/b/" + board + "/");

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    })

    // Obtener Threads
    .get(async (req, res) => {

      try {

        const board = req.params.board;

        const threads = await Thread.find({ board })
          .sort({ bumped_on: -1 })
          .limit(10)
          .select("-delete_password -reported");

        const result = threads.map(thread => {

          const obj = thread.toObject();

          obj.replycount = obj.replies.length;

          obj.replies = obj.replies
            .slice(-3)
            .map(reply => ({
              _id: reply._id,
              text: reply.text,
              created_on: reply.created_on
            }));

          return obj;

        });

        res.json(result);

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    })

    // Reportar Thread
    .put(async (req, res) => {

    })

    // Eliminar Thread
    .delete(async (req, res) => {

      try {

        const { thread_id, delete_password } = req.body;

        const thread = await Thread.findById(thread_id);

        if (!thread) {
          return res.send("incorrect password");
        }

        if (thread.delete_password !== delete_password) {
          return res.send("incorrect password");
        }

        await Thread.findByIdAndDelete(thread_id);

        res.send("success");

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    });


  app.route("/api/replies/:board")

    // Crear Reply
    .post(async (req, res) => {

      try {

        const { thread_id, text, delete_password } = req.body;

        const thread = await Thread.findById(thread_id);

        if (!thread) {
          return res.status(404).send("Thread not found");
        }

        thread.replies.push({
          text,
          delete_password
        });

        thread.bumped_on = new Date();

        await thread.save();

        res.redirect("/b/" + req.params.board + "/" + thread_id);

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    })

    // Obtener un Thread con todas las replies
    .get(async (req, res) => {

      try {

        const { thread_id } = req.query;

        const thread = await Thread.findById(thread_id)
          .select("-delete_password -reported");

        if (!thread) {
          return res.status(404).send("Thread not found");
        }

        const result = thread.toObject();

        result.replies = result.replies.map(reply => ({
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on
        }));

        res.json(result);

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    })

    // Reportar Reply
    .put(async (req, res) => {

    })

    // Eliminar Reply
    .delete(async (req, res) => {

      try {

        const { thread_id, reply_id, delete_password } = req.body;

        const thread = await Thread.findById(thread_id);

        if (!thread) {
          return res.send("incorrect password");
        }

        const reply = thread.replies.id(reply_id);

        if (!reply) {
          return res.send("incorrect password");
        }

        if (reply.delete_password !== delete_password) {
          return res.send("incorrect password");
        }

        reply.text = "[deleted]";

        await thread.save();

        res.send("success");

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    });

};