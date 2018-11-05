const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();
console.log(id);

// timestamp
const id2 = new mongoose.Types.ObjectId();
console.log(id2.getTimestamp());

// validate
const isValid = mongoose.Types.ObjectId.isValid('1234');
console.log(isValid);
