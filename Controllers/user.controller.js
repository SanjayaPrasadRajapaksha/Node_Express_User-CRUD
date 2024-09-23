import userService from "../Services/user.service.js";
import mailService from "../Services/mail.service.js";

const userController = {

    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const result = await userService.registerUser(name, email, password);

            if (result.status) {
                await mailService.sendEmail(
                    name,
                    email
                );
                res.status(200).json({
                    response_code: 200,
                    result
                });
            } else {
                res.status(400).json({
                    response_code: 400,
                    result
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                response_code: 500,
                success: false,
                message: error.message
            });
        }
    },

    userLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await userService.userLogin(email, password);
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    success: true,
                    result: result
                });
            } else {
                res.status(400).json({
                    response_code: 400,
                    success: false,
                    message: result.message
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                response_code: 500,
                error: error.message
            });
        }
    },

    changeUserPassword: async (req, res) => {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;
        if (newPassword.length < 8) {
            return res.status(400).json({
                response_code: 400,
                error: "New password must be at least 8 characters long"
            });
        }
        try {
            const result = await userService.changeUserPassword(
                userId,
                oldPassword,
                newPassword
            );
            if (result.status === false) {
                res.status(400).json({
                    response_code: 400,
                    error: result.message
                });
            } else {
                res.status(200).json({
                    response_code: 200,
                    result, success: true,
                    message: "User password updated"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({

                response_code: 500,
                error: "Error occurred!"
            });
        }
    },

    changeEmail: async (req, res) => {
        const userId = req.params.id;
        const { oldEmail, newEmail } = req.body;
        try {
            const updatedUser = await userService.changeEmail(oldEmail, newEmail, userId);
            if (updatedUser.status) {
                return res.status(200).json({
                    response_code: 200,
                    success: true,
                    message: "User email updated successfully",
                    updatedUser: updatedUser.data,
                });
            } else {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: updatedUser.message || "User not found or not updated",
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },

    changeName: async (req, res) => {
        const userId = req.params.id;
        const { oldName, newName } = req.body;
        try {
            const updatedUser = await userService.changeName(oldName, newName, userId);
            if (updatedUser.status) {
                return res.status(200).json({
                    response_code: 200,
                    success: true,
                    message: "User name updated successfully",
                    updatedUser: updatedUser.data,
                });
            } else {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: updatedUser.message || "User not found or not updated",
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },

    getUserById: async (req, res) => {

        try {
            const userId = req.params.id;
            const result = await userService.getUserById(userId);
            if (!result.status) {
                res.status(404).json({
                    status: result.status,
                    message: result.message,
                    data: result.data,
                });
            } else {
                res.status(200).json({
                    status: result.status,
                    message: result.message,
                    data: result.data,
                });
            }
        } catch (error) {
            res.status(400).json({
                status: false,
                message: error,
                data: "Error regarding fetching user",
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            if (!result.status) {
                res.status(404).json({
                    status: result.status,
                    message: result.message,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: result.status,
                    message: result.message,
                    data: result.data,
                });
            }
        } catch (error) {
            res.status(400).json({
                status: false,
                message: error,
                data: "Error regarding fetching users",
            });
        }
    },

    updateUser: async (req, res) => {
        const userId = req.params.id;
        const { name, email, password } = req.body;
        try {
            const updatedUser = await userService.updateUser(userId, name, email, password);
            console.log(updatedUser);
            if (updatedUser.status) {
                return res.status(200).json({
                    response_code: 200,
                    success: true,
                    message: "User updated successfully",
                    updatedUser: updatedUser.data,
                });
            } else {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: updatedUser.message || "User not found or not updated",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await userService.deleteUser(id);
            if (!result.status) {
                res.status(400).json({
                    status: result.status,
                    message: result.message,
                    data: result.data,
                });
            } else {
                res.status(200).json({
                    status: result.status,
                    message: result.message,
                    data: result.data,
                });
            }
        } catch (error) {
            res.status(400).json({
                status: false,
                message: error,
                data: "Error regarding deleting user",
            });
        }
    }
}

export default userController;