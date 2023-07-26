const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

//Schema used to create the Thought model 
const thoughtSchema = new Schema(
    {
        thoughtText: { type: String, 
                    required: true, 
                    unique: true, 
                    minLength: 1,
                    maxLength: 280 },
        createdAt: { type: Date, 
                 default: Date.now, 
                 get: (date) => {return date.toDateString(date)}, 
                },
        username: {
                    type: String,
                    required: true,
                  },
        
        reactions: [Reaction],
                    
    },
    {
        toJSON: {
            virtuals: true,
    },
        id: false,
    }

);
// This creates a virtual called "reactionCount" to gets the number of reactions for each Thought
thoughtSchema.virtual('reactionCount')
.get(function () {
    return this.reactions.length;
})

//Initialize the User model

const Thought = model('thought', thoughtSchema);

module.exports = Thought;