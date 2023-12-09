import messageModel from "../model/messageModel.mjs";

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: message,
      users: [from, to],
      sender: from,
      reciever: to,
    });
    if (!data) return res.json({ msg: "Failed to save message to database" });
    return res.json({ message, to: to });
  } catch (ex) {
    next(ex);
  }
};
export const getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    // res.json(messages);

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
