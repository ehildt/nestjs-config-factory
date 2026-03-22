import { Provider } from "@nestjs/common";

export interface ConfigFactoryOptions {
  global?: boolean;
  providers?: Array<Provider>;
}
