import express from 'express';

const router = express.Router();
import {indexController} from '../controller/index-controller.js';

router.get("/", indexController.index.bind(indexController));

router.post("/filter", indexController.filter);
router.post("/sort", indexController.sort);
router.post("/toggle", indexController.toggle);

export const indexRoutes = router;
