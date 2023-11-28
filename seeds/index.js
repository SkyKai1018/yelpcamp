//region require
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
//endregion require

//region connect
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
//endregion connect

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '655f0ee3d1101e876d5c4c65',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima sapiente eius consequuntur dolore tenetur ipsum, nam alias voluptas quia. Ullam saepe corporis debitis, culpa ab quibusdam magni impedit qui cupiditate.',
            price: price,
            geometry:
            {
                type: 'Point', coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dnbcxgi4w/image/upload/v1701075289/YelpCamp/hp89teijridcwtn7eyq9.jpg',
                    filename: 'YelpCamp/hp89teijridcwtn7eyq9'
                },
                {
                    url: 'https://res.cloudinary.com/dnbcxgi4w/image/upload/v1701075289/YelpCamp/raznjp7xpsp9r3wnfmsv.jpg',
                    filename: 'YelpCamp/raznjp7xpsp9r3wnfmsv'
                },
                {
                    url: 'https://res.cloudinary.com/dnbcxgi4w/image/upload/v1701075290/YelpCamp/cclp0h5tkhyqtkk5rptt.jpg',
                    filename: 'YelpCamp/cclp0h5tkhyqtkk5rptt'
                }
            ]
        });
        await camp.save();
    }
}

seedDB();
