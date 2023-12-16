import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected) {
        console.log('Mongodb is already coonected');
        return;
    }
    // try and catch statement
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'Travellog',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected =  true
        console.log('MongoDb is connected');
    } catch (error) {
        console.log(error);
    }
};