'use strict';

const qs = require('querystring');
const connectToDatabase = require('./db');
const Todo = require('./model');

module.exports.index = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Todo.get((err, todos) => {
        if (err) {
            callback(null, {
              statusCode: err.statusCode || 500,
              body: JSON.stringify({
                status: "error",
                message: err
              })
            })
        } else {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                status: "success",
                message: "Tasks retrieved successfully",
                data: todos
              })
            })
        }
    });
  });
};

module.exports.new = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let req = qs.parse(event.body)
  connectToDatabase().then(() => {
    let todo = new Todo()
    todo.description = req.description
    todo.status = req.status ? req.status : false
    todo.save((err) => {
        if (err) {
          callback(null, {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
              status: "error",
              message: err
            })
          })
        } else {
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              status: "success",
              message: "New task added!",
              data: todo
            })
          })
        }
    });
  });
};

module.exports.view = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase().then(() => {
      Todo.findById(event.pathParameters.id, (err, todo) => {
          if (err) {
            callback(null, {
              statusCode: err.statusCode || 500,
              body: JSON.stringify({
                status: "error",
                message: err
              })
            })
          } else {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                status: "success",
                message: "Task retrieved successfully",
                data: todo
              })
            })
          }
    });
  });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let req = qs.parse(event.body)
  console.log(req)
  connectToDatabase().then(() => {
      Todo.findById(event.pathParameters.id, (err, todo) => {
          if (err) {
            callback(null, {
              statusCode: err.statusCode || 500,
              body: JSON.stringify({
                status: "error",
                message: err
              })
            })
          }
          todo.description = req.description ? req.description : todo.description
          todo.status = req.status ? req.status : todo.status 
          todo.save((err) => {
              if (err) {
                callback(null, {
                  statusCode: err.statusCode || 500,
                  body: JSON.stringify({
                    status: "error",
                    message: err
                  })
                })
              } else {
                callback(null, {
                  statusCode: 200,
                  body: JSON.stringify({
                    status: "success",
                    message: "Task updated!",
                    data: todo
                  })
                })
              }
          })
      });
    });
};

module.exports.delete = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase().then(() => {
      Todo.deleteOne({
          _id: event.pathParameters.id 
      }, (err, todo) => {
          if (err) {
            callback(null, {
              statusCode: err.statusCode || 500,
              body: JSON.stringify({
                status: "error",
                message: err
              })
            })
          } else {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                status: "success",
                message: "Task deleted!"
              })
            })
          }
      });
    });
};