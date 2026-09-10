import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            validate: {
                validator: (members) => {
                    return members.length === 2;
                },
                message:
                    "A direct conversation must have exactly two members.",
            },
            required: true,
        },

        type: {
            type: String,
            enum: ["direct"],
            default: "direct",
        },
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({
    members: 1,
});

const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

export default Conversation;