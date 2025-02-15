import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

/**
 * Controller function to handle sending a message between two users.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    // Extract message content from request body
    const { message } = req.body;

    // Extract receiver's ID from request parameters
    const { id: receiverId } = req.params;

    // Get sender's ID from authenticated user
    const senderId = req.user.id;

    // Check if a conversation already exists between sender and receiver
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    // If conversation doesn't exist, create a new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    // Create a new message with sender's ID, message content, and conversation ID
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    // Update conversation to include the new message
    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    //Add socket.io code here

    // Send the new message as response
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
