const { Schema, Types } = require('mongoose');

//Schema used to create the Reaction Model

const reactionSchema = new Schema(
    {
        reactionId: { 
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
            },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
            },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {return date.toDateString(date)},
        }
    }
);


module.exports = reactionSchema;