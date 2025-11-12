import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const userService = {
  // async getUser(id) {},
  async registerUser({ name, email, password }) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      const token = generateToken(user);
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.log(error);
    }
  },

  async loginUser({ email, password }) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
  
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
  
      const token = generateToken(user);
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.log("Login Error:", error.message);
      throw new Error(error.message || "Login failed");
    }
  }
  
};
export default userService;
