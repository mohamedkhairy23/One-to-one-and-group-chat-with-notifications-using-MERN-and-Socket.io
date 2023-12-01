const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChatExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChatExist = await User.populate(isChatExist, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChatExist.length > 0) {
    res.send(isChatExist[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a logged in user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    let loggedInUserChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    loggedInUserChats = await User.populate(loggedInUserChats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(loggedInUserChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users | !req.body.chatName) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to create a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const chatExist = await Chat.findById(chatId);

  if (!chatExist) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true, runValidators: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(updatedChat);
});

// @desc    Add a user to Group
// @route   PUT /api/chat/addtogroup
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chatExist = await Chat.findById(chatId);
  if (!chatExist) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  if (chatExist.groupAdmin.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Only admin of that group can add a user");
  }

  // const isUerExistInThatGroup = await Chat.findOne({
  //   users: { $elemMatch: { $eq: userId } },
  // });
  // if (isUerExistInThatGroup) {
  //   res.status(400);
  //   throw new Error("User already exist in that group");
  // }

  const addUserToGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true, runValidators: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(addUserToGroupChat);
});

// @desc    Remove a user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chatExist = await Chat.findById(chatId);

  if (!chatExist) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  if (chatExist.groupAdmin.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Only admin of that group can remove a user");
  }

  const removeUserFromGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(removeUserFromGroup);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
