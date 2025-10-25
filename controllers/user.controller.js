import userService from '../service/user.service.js';
import { loginUserSchema, registerUserSchema } from '../validation/user.validation.js';

const userController = {
  //   async getUser(req, res) {},
  async registerUser(req, res) {
    try {
      const data = registerUserSchema.parse(req.body);
      const { name, email, password } = data;
      console.log('data', data);
      const result = await userService.registerUser({ name, email, password });
      console.log('result', result);
      res.status(201).json({ message: 'User registered successfully', ...result });
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
      res.status(200).json({ message: 'User logged in successfully', ...result });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  },
};

export default userController;
