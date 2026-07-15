'use strict';

const Thread = require("../models/Thread");

module.exports = function (app) {

  app.route("/api/threads/:board")

    .post(async (req, res) => {

      try {

        const { text, delete_password } = req.body;
        const board = req.params.board;

        console.log("===== NUEVO THREAD =====");
        console.log("Board:", board);
        console.log("Text:", text);
        console.log("Password:", delete_password);

        const thread = new Thread({
          board,
          text,
          delete_password
        });

        console.log("Intentando guardar en MongoDB...");

        await thread.save();

        console.log("✅ Thread guardado correctamente");
        console.log(thread);

        res.redirect("/b/" + board + "/");

      } catch (err) {

        console.log("❌ ERROR AL GUARDAR");
        console.error(err);

        res.status(500).send("Server Error");

      }

    })

    .get(async (req, res) => {

      try {

        const board = req.params.board;

        const threads = await Thread.find({ board })
          .sort({ bumped_on: -1 })
          .limit(10);

        res.json(threads);

      } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

      }

    })

    .put(async (req, res) => {

    })

    .delete(async (req, res) => {

    });


  app.route("/api/replies/:board")

    .post(async (req, res) => {

    })

    .get(async (req, res) => {

    })

    .put(async (req, res) => {

    })

    .delete(async (req, res) => {

    });

};