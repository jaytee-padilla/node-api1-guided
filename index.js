// import express from express
const express = require('express');
// import database model
const db = require('./data/hubs-model');

const server = express();
// this line of code is needed to parse JSON data from the body of a request
server.use(express.json());

const port = 4000;
server.listen(port, () => 
	console.log(`\n ** API is running on port ${port} **`)
);

server.get(`/`, (req, res) => {
	res.json("API is up and running :D");
})

// GET list of hubs
server.get(`/hubs`, (req, res) => {
	db.find()
		.then(hubs => {
			res.status(200).json(hubs)
		})
		.catch(error => {
		console.log('error on GET /hubs', error);

		res
			.status(500)
			.json({errorMessage: "Error getting list of hubs from database"});
	})
})

// ADD a hub
server.post(`/hubs`, (req, res) => {
	// express does NOT know how to parse JSON data
	const hubData = req.body;

	db.add(hubData)
		.then(newHub => {
			res.status(201).json(newHub);
		})
		.catch(error => {
			console.log("error on POST /hubs", error);

			res.status(500)
			.json({errorMessage: "Error adding new hub to list of hubs in database"});
		})
})

// REMOVE a hub by it's id
server.delete(`/hubs/:id`, (req, res) => {
	const id = req.params.id;

	db.remove(id)
		.then(removed => {
			if (removed) {
				res.status(200).json({successMessage: "Hub was deleted successfully", removed});
			} else {
				// there was no hub with that id
				res.status(404)
				.json({errorMessage: "The hub you're looking for was not found"});
			}
		})
		.catch(error => {
			console.log("error on DELETE /hubs/:id", error);

			res.status(500)
			.json({errorMessage: "Error removing the hub"});
		})
})

// update a hub by it's id