const mongoose = require('mongoose');
const todoSchema = mongoose.Schema({
    description: {
        type: String,
        required: true 
    },
    status: {
        type: Boolean,
        default: false
    }
});

const Todo = module.exports = mongoose.model('todo', todoSchema);
module.exports.get = (callback, limit) =>  {
    Todo.find(callback).limit(limit)
};