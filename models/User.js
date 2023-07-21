const { Schema, model } = require('mongoose');

//Schema used to create the User model 
const userSchema = new Schema(
    {
        username: { type: String, 
                    required: true, 
                    unique: true, 
                    trim: true },
        email: { type: String, 
                 required: true, 
                 unique: true, 
                 match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]},
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User', 
            }
        ]
                    
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);
// This creates a virtual called "friendCount" to gets the number of friends for each User
userSchema.virtual('friendCount')
.get(function () {
    return this.friends.length;
})

//Initialize the User model

const User = model('user', userSchema);

module.exports = User;