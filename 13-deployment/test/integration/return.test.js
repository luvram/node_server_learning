const moment = require('moment');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server;
    let rental;
    let customerId;
    let movieId;
    let token;
    let movie;

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }
    beforeAll(async () => {
        server = require('../../index');
    });

    afterAll(async () => {
        await server.close();
    });

    beforeEach(async () => {
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: {
                name: 'genre1',
            },
            numberInStock: 1,
            dailyRentalRate: 2,
        });
        await movie.save();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2,
            },
        });
        await rental.save();
    });
    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});
    })

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided.', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 400 if movieId is not provided.', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 404 if no rental found for the customer/movie', async () => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it('should return 400 if rental already processed.', async () => {
        rental.dateReturned = new Date();
        rental.save();

        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if input is valid request', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it('should set the return Date if input is valid', async () => {
        await exec();
        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dateReturned;
        expect(diff).toBeLessThan(10 * 1000); // 10초 안된것으로 체크
        // expect(rentalInDB.dateReturned).toBeDefined();
    });
    it('should set the rentalFee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(14);

    });
    it('should increase the movie stock if input is valid', async () => {
        await exec();

        const movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);

    });
    it('should return the rental if input is valid', async () => {
        const res = await exec();
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        );


    });
})