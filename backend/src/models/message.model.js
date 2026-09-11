import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 5000,
        },

        type: {
            type: String,
            enum: ["text"],
            default: "text",
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({
    conversation: 1,
    createdAt: -1,
});

const Message = mongoose.model(
    "Message",
    messageSchema
);

export default Message;