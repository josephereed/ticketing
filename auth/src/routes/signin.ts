import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@jrtickets/common';

import { User } from '../models/userModel';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const storedUser = await User.findOne({ email });
    if (!storedUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const storedPassword = storedUser.password;

    const passwordMatch = await Password.compare(storedPassword, password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    if (passwordMatch) {
      const userJwt = jwt.sign(
        {
          id: storedUser.id,
          email: storedUser.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(200).send(storedUser);
    }
  }
);

export { router as signinRouter };
