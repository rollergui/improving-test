import { Response } from "express";
import HTTPError from "./HTTPError";

export default class HTTPErrorHandler {
  static handle(error: HTTPError|Error, res: Response) {
    if (error instanceof HTTPError) {
      res.status(error.code).json(error.body);
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
}