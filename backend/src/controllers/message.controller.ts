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

/**
 * Retrieves messages from a conversation between the authenticated user and another user.
 *
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 */

export const getMessages = async (req: Request, res: Response) => {
  try {
    // Extract the user to chat with from the request parameters and the sender ID from the authenticated user
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    // Find the conversation between the sender and the user to chat with, including all messages in the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // If no conversation is found, return an empty array
    if (!conversation) {
      return res.status(200).json([]);
    }

    // Return the messages in the conversation
    res.status(200).json(conversation.messages);
  } catch (error: any) {
    console.error('Error in getMessages: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieves a list of users, excluding the currently authenticated user,
 * and returns them in a JSON response.
 *
 * @param {Request} req - The incoming HTTP request
 * @param {Response} res - The outgoing HTTP response
 */
export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    // Get the ID of the currently authenticated user
    const authUserId = req.user.id;

    // Query the database for users with IDs that do not match the authenticated user's ID
    const users = await prisma.user.findMany({
      // Filter out the authenticated user
      where: {
        id: {
          not: authUserId,
        },
      },
      // Select only the desired fields
      select: {
        id: true,
        fullName: true,
        profilePic: true,
      },
    });
    // Return the list of users in a JSON response with a 200 status code
    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error in getUsersForSidebar: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
