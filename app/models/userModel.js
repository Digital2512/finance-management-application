// app/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  addressLine3: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  country: { type: String, required: true },
  selectedPlan: { type: String, required: true },
});

// var User;

// if (mongoose.models.User) {
//   User = mongoose.model('User');
// } else {
//   User = mongoose.model('User', userSchema);
// }

var User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
