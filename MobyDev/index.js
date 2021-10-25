const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const app = express();

async function start() {
    try {
        await mongoose.connect('mongodb+srv://Aleksandr:1q2w3e4r@cluster0.dhclf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start();


// 1. Создаем 100 случайных юзеров
// const myModel = mongoose.model('User', new mongoose.Schema({userID: String}));
// const db = new myModel();

// for (let i = 1; i <= 100; i++) {
//     db.collection.insertOne(
//     {
//         'Name': 'User'+ i
//     });
// };


// 2. 300 связей

const contactSchema =  new mongoose.Schema({userId: String, follower: String});
const myModelContact = mongoose.model('Contact', contactSchema);
const doc3 = new myModelContact();

// function getRandomUser(min = 1, max = 100) {
//     return Math.floor(Math.random()*(max-min)+min);
// }

// for (let i = 1; i <= 300; i++) {
//     const userID = "User" + getRandomUser();
//         const follower = "User" + getRandomUser();
//         if(userID !== follower) {
//             doc3.collection.insertOne(
//                 {
//                     "userID": userID,
//                     "follower": follower
//                 }
//             )
//         }
// }

// 4. Наиболее популярные
async function popular(){
    return await myModelContact.aggregate([
        {
          '$group': {
            '_id': {
              'userID': '$userID'
            }, 
            'userIDCount': {
              '$sum': 1
            }, 
            'follower': {
              '$addToSet': '$follower'
            }
          }
        }, 
            {
          '$sort': {
            'userIDCount': -1
          }
        }, {
          '$limit': 3
        }
    ])
}

popular()

app.get("/api/popular", async function(req, res) {
  try{
      let response = await popular()
      // console.log(response)
      res.send(response); 
    } catch (error) {
      console.log(error)
    }
    
})