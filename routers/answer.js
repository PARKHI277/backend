const express = require("express");
const router = new express.Router();
const Answer = require("../schema_details/answer");
const Question = require("../schema_details/question");
const User = require("../schema_details/user");
const atob = require("atob");
const verify = require("../middleware/auth");

router.put("/answer", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains Userid
    console.log(dec);
    const { question, category, userAnswer, ansid, Qid } = await req.body;

    const existAns = await Answer.find({Qid: Qid,userId: decode._id});
    if(existAns.length!=0)
    {
  
      await Answer.findOneAndUpdate(
        {
          _id: existAns[0]._id,
        },
        {
          $set: {
            ansid: ansid,
            userAnswer:userAnswer
          },
        }
      );
      console.log(existAns[0]._id);
      const quesFound = await Question.findById(Qid);

      if (quesFound) {
        for (let i = 0; i < 4; i++) {
          if (userAnswer == quesFound.options[i].Oid) {
            const selopt = quesFound.options[i].value;
            await Answer.findOneAndUpdate(
              {
                _id: existAns[0]._id,
              },
              {
                $set: {
                  selectedOpt: selopt,
                },
              }
            );
  
            if (quesFound.options[i].isCorrect === true) {
              await Answer.findOneAndUpdate(
                {
                  _id: existAns[0]._id,
                },
                {
                  $set: {
                    isCorrect: true,
                  },
                }
              );
              console.log("Correct answer");
            }
          }
        }
      }
      // change
      const Foundans = await Answer.findById(existAns[0]._id);
      const selopt = Foundans.selectedOpt;
  
      let msg = "Answer added successfully";
      if (ansid === 1 && selopt!="") {
        msg = "Answer saved successfully";
      } else if (ansid === 3 && selopt!="") {
        msg = "marked and review successfully added";
      }
      else if((ansid==1 || ansid==3) && selopt==""){
        msg = "attempted but not answer";
      }
       res.status(201).send({ msg, ansid, selopt, isVerified, });
    
    }
    else{
    let answer_create = new Answer({
      userId: decode,
      question,
      category,
      userAnswer,
      ansid,
      Qid,
    });
    await answer_create.save();

    await User.findOneAndUpdate(
      {
        _id: answer_create.userId,
      },
      {
        $push: { results: answer_create._id },
      }
    );


    const quesFound = await Question.findById(Qid);

    if (quesFound) {
      for (let i = 0; i < 4; i++) {
        if (userAnswer == quesFound.options[i].Oid) {
          const selopt = quesFound.options[i].value;
          await Answer.findOneAndUpdate(
            {
              _id: answer_create._id,
            },
            {
              $set: {
                selectedOpt: selopt,
              },
            }
          );

          if (quesFound.options[i].isCorrect === true) {
            await Answer.findOneAndUpdate(
              {
                _id: answer_create._id,
              },
              {
                $set: {
                  isCorrect: true,
                },
              }
            );
            console.log("Correct answer");
          }
        }
      }
    }
    // change
    const Foundans = await Answer.findById(answer_create._id);
    const selopt = Foundans.selectedOpt;

    let msg = "Answer added successfully";
    if (ansid === 1 && selopt!="") {
      msg = "Answer saved successfully";
    } else if (ansid === 3 && selopt!="") {
      msg = "marked and review successfully added";
    }
    else if((ansid==1 || ansid==3) && selopt==""){
      msg = "attempted but not answer";
    }
     res.status(201).send({ msg, ansid, selopt, isVerified, });
  
  }  } catch (error) {
    res.status(500).send(`err ${error}`);
  }
});

router.put("/seeanswer", async (req, res) => {
  try {
    const userId = req.body.userId;

    const AnswerData = await Answer.find({ userId: userId }).populate(
      "userId",
      "name studentNum branch score loginAt"
    );
    res.status(201).send(AnswerData);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

module.exports = router;