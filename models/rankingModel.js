const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rankingSchema = new Schema({
  
  horse: { type: String, required: true, unique: true
  },
  
  winnings: { type: Number, required: true, default: 0
  }
  
});

const Ranking = mongoose.model('rankings', rankingSchema);
module.exports = Ranking;