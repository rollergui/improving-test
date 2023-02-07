import express, { Express, NextFunction, Request, Response } from "express";
import expressPinoLogger from "express-pino-logger";
import { logger } from "../../utils/Logger";
import swaggerUi from "swagger-ui-express";
import * as swaggerDoc from "./swagger.json";
import { AllowedSchema, ValidationError, Validator } from "express-json-validator-middleware";
import TransactionService from "../../application/TransactionService";
import HTTPError from "./HTTPError";
import HTTPErrorHandler from "./HTTPErrorHandler";
import InvalidAmountError from "../../domain/error/InvalidAmountError";
import ExternalServiceError from "../../domain/error/ExternalServiceError";

export default class Controller {
  app: Express;
  validator: Validator;

  constructor(readonly transactionService: TransactionService) {
    this.app = express();
    this.app.use(expressPinoLogger({ logger: logger }));
    this.app.use(express.json());
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    this.validator = new Validator({});

    this.registerRoutes();
    this.pokemonErrorHandler();

    this.app.listen(3000);
  }

  registerRoutes() {
    this.app.post(
      "/transactions",
      this.validator.validate({ body: convertCurrencySchema }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const output = await this.transactionService.convert(req.body);
          res.json(output);
        } catch(error: any) {
          next(error);
        }
      }
    );

    this.app.get(
      "/transactions",
      this.validator.validate({ query: listTransactionsByUserSchema }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const userId = req.query.userId as string;
          const output = await this.transactionService.listByUser(+userId);
          res.json(output);
        } catch (error: any) {
          next(error);
        }
      }
    );
  }

  pokemonErrorHandler() {
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      let httpError: HTTPError;
      switch(error.constructor) {
        case ValidationError:
          httpError = new HTTPError(error.validationErrors, 400);
          break;
        case InvalidAmountError:
          httpError = new HTTPError(error.message, 422);
          break;
        case ExternalServiceError:
          httpError = new HTTPError(error.message, 502);
          break;
        default:
          httpError = new HTTPError(error.message);
      }
      HTTPErrorHandler.handle(httpError, res);
    });
  }
}

const convertCurrencySchema: AllowedSchema = {
  type: "object",
  properties: {
    userId: {
      type: "number"
    },
    initialCurrency: {
      type: "string",
      enum: ["USD", "BRL", "EUR", "JPY"]
    },
    initialAmount: {
      type: "number"
    },
    currency: {
      type: "string",
      enum: ["USD", "BRL", "EUR", "JPY"]
    }
  },
  required: ["userId", "initialCurrency", "initialAmount", "currency"]
};

const listTransactionsByUserSchema: AllowedSchema = {
  type: "object",
  properties: {
    userId: {
      type: "string"
    }
  },
  required: ["userId"]
};