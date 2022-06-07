const express = require("express");
const User = require("../schema_details/user");
const router = new express.Router();
router.get("/register", async (req, res) => {
  try {
    const Usersdata = await User.find();
    res.status(201).send(Usersdata);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      studentNum,
      rollNum,
      mobileNum,
      year,
      branch,
      gender,
      isHosteler,
      startTime
    } = await req.body;
    const userExist = await User.findOne({ rollNum });

    if (userExist) {
      return res.status(200).send({ msg: "User already exists." });
    }

    const user_create = new User({
      name,
      email,
      studentNum,
      rollNum,
      mobileNum,
      password: `Csi@${studentNum}`,
      year,
      branch,
      gender,
      isHosteler,
<<<<<<< HEAD
      startTime,
      currentTime,
      endTime,
      // hasAppeared,
=======
      startTime
>>>>>>> 1560586887f9896f2ed52b49b80e08e0be8d69be
    });

    if (user_create.password === process.env.ADMIN_PASSWORD)
      user_create.isAdmin = true;
    const saveUser = await user_create.save();
    res.status(201).send(saveUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

//getting the user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findbyId(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Update a user

router.put("/update", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account got updated");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
