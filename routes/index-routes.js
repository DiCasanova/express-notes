import express from 'express';

const router = express.Router();
import {indexController} from '../controller/index-controller.js';

router.get("/", indexController.index.bind(indexController));

router.get("/edit", indexController.edit);
router.post("/edit_submit", indexController.edit_submit)

export const indexRoutes = router;
