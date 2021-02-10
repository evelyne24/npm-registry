import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { Logger, LoggerFactory } from "../utils/LoggerFactory";
import { Controller, HttpMethod } from "./Controller";
import { VulnerabilityChecker } from "../service/VulnerabilityChecker";

@injectable()
export class GetVulnerabilities implements Controller {
  readonly path: string = "/vulnerabilities/:name/:version";
  readonly method: HttpMethod = "GET";

  private readonly log: Logger;

  constructor(
    @inject("LoggerFactory") readonly loggerFactory: LoggerFactory,
    @inject("VulnerabilityChecker")
    private readonly vulnerabilityChecker: VulnerabilityChecker
  ) {
    this.log = loggerFactory.getLogger(GetVulnerabilities.name);
  }

  readonly handler: RequestHandler = async (req, res, next) => {
    const { version, name } = req.params;
    // TODO validation

    try {
      const tree = await this.vulnerabilityChecker.checkVulnerabilities(
        name,
        version
      );
      return res.status(200).json(tree);
    } catch (error) {
      return next(error);
    }
  };
}
