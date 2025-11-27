import { User } from '../models/game.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
