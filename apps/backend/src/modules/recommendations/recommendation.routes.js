const express = express();

import { getRecommendations } from "./recommendation.controller.js";

const router = express.Router();

router.get("/recommendations",getRecommendations);

export default router;