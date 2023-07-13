import express from 'express';

const router = express.Router();
import {indexController} from '../controller/index-controller.js';

router.get("/", indexController.index.bind(indexController));

router.get("/edit", indexController.newNote);
router.get("/edit/:id/", indexController.showNote);
router.post("/edit", indexController.createNote);
router.post("/edit/:id/", indexController.updateNote);
router.post("/filter", indexController.filter);

//router.delete("/orders/:id/", indexController.delete);

export const indexRoutes = router;
