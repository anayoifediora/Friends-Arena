const connection = require('../config/connection');
const { Thought, Reaction } = require('../models');
const {
  getRandomName,
  getRandomReactions,
  getRandomThought,
  genRandomIndex,
} = require('./data');

// Start the seeding runtime timer
console.time('seeding');

// Creates a connection to mongodb
connection.once('open', async () => {
  // Delete the collections if they exist
  let postCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (postCheck.length) {
    await connection.dropCollection('thoughts');
  }

  let reactionCheck = await connection.db.listCollections({ name: 'reactions' }).toArray();
  if (reactionCheck.length) {
    await connection.dropCollection('reactions');
  }

  // Empty arrays for randomly generated thoughts and reactions
  const reactions = [...getRandomReactions(10)];
  const thoughts = [];

  // Makes reactions array
  const makePost = (text) => {
    thoughts.push({
      text,
      username: getRandomName().split(' ')[0],
      reactions: [reactions[genRandomIndex(reactions)]._id],
    });
  };

  // Wait for the reactions to be inserted into the database

  await Reaction.collection.insertMany(reactions);

  // For each of the reactions that exist, make a random thought of 10 words
  reactions.forEach(() => makePost(getRandomThought(10)));

  // Wait for the thoughts array to be inserted into the database
  await Thought.collection.insertMany(thoughts);

  // Log out a pretty table for reactions and thoughts
  console.table(reactions);
  console.table(thoughts);
  console.timeEnd('seeding complete 🌱');
  process.exit(0);
});
