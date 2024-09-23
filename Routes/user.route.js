import userController from '../Controllers/user.controller.js';

import express from 'express';

const router = express.Router();

// Define routes
router.post('/register', userController.registerUser);
router.post('/login', userController.userLogin);
router.patch("/changePassword/:id", userController.changeUserPassword);
router.patch("/changeEmail/:id", userController.changeEmail);
router.patch("/changeName/:id", userController.changeName);
router.get('/get/:id', userController.getUserById);
router.get('/getAll', userController.getAllUsers);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

export default router;
