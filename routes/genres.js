const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const router = express.Router();

const genreSchema = new mongoose.Schema({
  name:{
    type: String,
    maxlength: 25,
    minlength: 5,
    required: true
  }
});

const Genre = mongoose.model('Genre', genreSchema);


router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if(!genre) return res.status(404).send('the Given ID was not found in the genres');

  res.send(genre);
});

router.post('/', async (req, res) => {
  const { error } = validateRoutes(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });

  genre = await genre.save();
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validateRoutes(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
    new: true
  });

  if(!genre) return res.status(404).send('The given ID is was not found');

  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if(!genre)
    return res.send('The given ID was not found');

  res.send(genres);
});

function validateRoutes(genre){
  const schema = {
    name: Joi.string().min(4).required()
  }
  return Joi.validate(genre, schema);
}

module.exports = router;