import "module-alias/register";
import "dotenv/config";

import { Deck } from "@lib";

const deck = new Deck();
deck.start().catch((error) => deck.logger.error(error));
