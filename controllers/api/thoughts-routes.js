const { Reaction, Thought, User } = require('../../models');
const router = require('express').Router();

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughtData = await Thought.find().populate('reactions').select('-__v');
        res.status(200).json(thoughtData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single thought by its _id
router.get('/:thoughtId', async (req, res) => {
    try {
        const thoughtData = await Thought.findOne({ _id: req.params.thoughtId })
        .populate('reactions')
        .select('-__v');

        if (!thoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.status(200).json(thoughtData);
    } catch(err) {
        res.status(500).json(err);
    }
});

// CREATE a new thought

router.post('/', async (req, res) => {

    try {
        const thoughtData = await Thought.create(req.body);
        const userData = await User.findOneAndUpdate(
            { _id: req.body.userId },
            {$addToSet: { thoughts: thoughtData._id }},
            { new: true }
        );
        if (!userData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json(thoughtData);
    } catch (err) {
        res.status(500).json(err);
    }
})

// CREATE a reaction stored in a single thought's reactions array field

router.post('/:thoughtId/reactions', async (req, res) => {

    try {
        // const reactionData = await Reaction.create(req.body);
        const thoughtData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );
            
        if (!thoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json('Reaction created!');
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a reaction by the reaction's reactionId value

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    
        try {
            const thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );
    
            if (!thoughtData) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
            res.json('Reaction deleted!');
        } catch (err) {
            res.status(500).json(err);
        }
});


// UPDATE a thought by its _id 

router.put('/:thoughtId', async (req, res) => {

    try {
        const thoughtData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json('Thought updated!');
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a thought by its _id

router.delete('/:thoughtId', async (req, res) => {

    try {

        const thoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json('Thought deleted!');

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;