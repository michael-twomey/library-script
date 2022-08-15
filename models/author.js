const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: {
    type: String,
    maxLength: 100,
    required: true,
  },
  family_name: {
    type: String,
    maxLength: 100,
    required: true,
  },
  date_of_birth: Date,
  date_of_death: Date,
});

AuthorSchema
  .virtual('name')
  .get(() => {
    let fullname = '';
    if (this.first_name && this.family_name) {
      fullname = `${this.first_name} ${this.family_name}`;
    }
    if (!this.first_name || !this.fullname) {
      fullname = '';
    }
    return fullname;
  });

AuthorSchema
  .virtual('url')
  .get(() => `/catalog/author/${this._id}`);

module.exports = mongoose.model('Author', AuthorSchema);
