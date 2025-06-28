import { Router } from "express";
import taskController from "../controllers/task.controller.js";

const router = Router();

router
    .route('/')
    .get(taskController.getTasks)
    .post(taskController.createTask);

router
    .route('/:id')
    .get(taskController.getTask)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask)
    .patch(taskController.taskDone);

export default router;