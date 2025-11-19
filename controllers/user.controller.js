import userService from '../service/user.service.js';
import { loginUserSchema, registerUserSchema } from '../validation/user.validation.js';

const userController = {
  //   async getUser(req, res) {},
  async registerUser(req, res) {
    try {
      const data = registerUserSchema.parse(req.body);
      const { name, email, password } = data;
      const result = await userService.registerUser({ name, email, password });
      res.status(201).json({ message: 'User registered successfully', result });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  },
  async loginUser(req, res) {
    try {
      const data = loginUserSchema.parse(req.body);
      const { email, password } = data;
      const result = await userService.loginUser({ email, password });
      res.status(200).json({ message: 'User logged in successfully', result });
    } catch (error) {
      console.error('Controller error:', error.message);
      res.status(400).json({ message: error.message || 'Login failed' });
    }
  },
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.getCurrentUserById(userId);
      res.status(200).json({ message: 'Current user fetched successfully', user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default userController;
