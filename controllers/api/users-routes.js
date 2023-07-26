const { Reaction, User, Thought } = require('../../models');
const router = require('express').Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.find().select('-__v');
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single user by its _id
router.get('/:userId', async (req, res) => {

    try {
        const userData = await User.findOne({ _id: req.params.userId })
        .select('-__v');

        if (!userData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json(userData);
    } catch(err) {
        res.status(500).json(err);
    }
});

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE a user by its _id

router.put('/:userId', async (req, res) => {
    try {
        const userData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true });
       
             if (!userData) {
            return res.status(404).json({ message: 'No user found with this id!' });
            }
        res.status(200).json({ message: 'User updated!' });
        
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a user by its _id

router.delete('/:userId', async (req, res) => {
    try {
        const userData = await User.findOneAndDelete({ _id: req.params.userId });
        
    if (!userData) {
        return res.status(404).json({ message: 'No user found with this id!' });
    }
    
    await Thought.deleteMany({ _id: { $in: userData.thoughts } });
    res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
        res.status(500).json(err);
        }
});

// ADD a new friend to a user's friend list

router.post('/:userId/friends/:friendId', async (req, res) => {

    try {
        const userData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );
        if (!userData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json('Friend added!');
        // res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a friend from a user's friend list

router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const userData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true });
        
        if (!userData) {
            return res.json({ message: 'No user found with this id!' });
        }
        res.json('Friend deleted!');
        // res.status(200).json(userData);
    
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;