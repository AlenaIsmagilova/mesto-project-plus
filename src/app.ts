import express, { Errback, NextFunction, Request, Response } from "express";
import mongoose, { Error } from "mongoose";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import { BadRequestError } from "errors/bad-request-err";
import { NotFoundError } from "errors/not-found-err";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req: any, res, next) => {
  req.user = {
    _id: "63ea9d23ef5671820db36264",
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(
  (
    err: BadRequestError | NotFoundError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
      message: statusCode === 500 ? "На сервере произошла ошибка" : message,
    });

    next();
  }
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
