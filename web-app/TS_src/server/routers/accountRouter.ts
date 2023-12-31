import { Router, Request, Response } from 'express';
import userController from '../controllers/userController';
import passport from 'passport';
import sessionController from '../controllers/sessionController';

const accountRouter: Router = Router();

accountRouter.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
  res.status(200).send(req.user);
});


accountRouter.post('/register', userController.checkUserExists, userController.register, (req: Request, res: Response) => {
  const response = {
    userExists: res.locals.userExists,
    userCreated: res.locals.userCreated,
  }
  res.status(200).json(response);
});

accountRouter.post('/logout', sessionController.endSession, (req: Request, res: Response) => {
  res.status(200).send({
    signedIn: res.locals.signedIn
  })
})

export default accountRouter;