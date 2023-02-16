import { Request } from "express";

export interface IRequest extends Request {
  user: {
    _id: string;
  };
}

// export type IRequest = Request<
// ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>
// > & {
//   user: {
//     _id: string;
//   };
// }
