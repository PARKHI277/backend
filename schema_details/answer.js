const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Qid: { type: Schema.Types.ObjectId, ref: "Question" },
  question: { type: String, required: true },
  category: { type: String, required: true },
  userAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  markRev: { type: Boolean, default: false }, // 3
  saveNext: { type: Boolean, default: false }, // 1
  // unvisited: { type: Boolean, default: true }, // 4
  // visited: { type: Boolean, default: false },

  ansid: {
    type: Number,
    default: 2,
  },
});

const Answer = new mongoose.model("Answer", answerSchema);

module.exports = Answer;

// 1 -> if question answered  and click on save and next -> Green
// 2 -> if question not answered  and move on to next -> red
// 3 -> if question answerd and click on mark for review -> purple
// 4 -> unvisited -> white
