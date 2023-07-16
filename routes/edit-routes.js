import express from 'express';

const router = express.Router();
import {editController} from '../controller/edit-controller.js';

router.get("/", editController.newNote);
router.get("/:id/", editController.showNote);
router.post("/", editController.createNote);
router.post("/:id/", editController.updateNote);

export const editRoutes = router;
