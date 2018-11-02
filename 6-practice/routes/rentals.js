const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

const { Rental, validateRental } = require('../models/rental');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  if( movie.numberInStock === 0) return res.status(400).send('Movie is not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });
  rental = await rental.save();

  movie.numberInStock--;
  await movie.save();

  res.send(rental);
});

router.put('/:id', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const rental = await Rental.findByIdAndUpdate(req.params.id,
    {
      customer: req.body.customerId,
      movie: req.body.movieId,
      endDate: req.body.endDate,
    }, { new: true });

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

router.delete('/:id', async (req, res) => {
  const rental= await Rental.findByIdAndRemove(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 