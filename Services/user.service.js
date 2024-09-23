import userRepository from "../Repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import validator from "validator";
import crypto from "crypto";

const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

const userService = {

    validatorEmail: (email) => {
        return validator.isEmail(email);
    },
    registerUser: async (name, email, password) => {
        const isAlreadyExist = await userRepository.checkUser(email);
        if (isAlreadyExist) {
            return { status: false, message: "User already exists" };
        }
        try {
            const user = await userRepository.registerUser(name, email, password);

            const token = jwt.sign({ user_id: user.id }, jwtSecret, {
                expiresIn: 259200,
            });
            return {
                user,
                token,
                status: true,
                message: "user registered successfully"
            }
        } catch (error) {
            throw error;
        }
    },

    userLogin: async (email, password) => {
        try {
            const user = await userRepository.getUserByEmailForLogin(email);
            if (!user) {
                return {
                    status: false,
                    message: 'User data not found!',
                };
            }
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return {
                    status: false,
                    message: 'Incorrect password!',
                };
            } else {
             
                if (user) {
                    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: 259200 })
                    return {
                        status: true,
                        message: 'Login Successfully!',
                        token: token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    };
                } else {
                    return {
                        status: false,
                        message: 'Token generate error',
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    },

    changeUserPassword: async (userId, oldPassword, newPassword) => {
        try {
            const User = await userRepository.getUserById(userId);
            if (!User[0]) {
                return {
                    status: false,
                    message: " User not found!",
                };
            }
            const passwordMatch = await bcrypt.compare(
                oldPassword,
                User[0].password
            );
            if (!passwordMatch) {
                return {
                    status: false,
                    message: "Incorrect old password!",
                };
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            const result = await userRepository.changeUserPassword(userId, newPasswordHash);
            if (!result) {
                return {
                    status: false,
                    message: "Password update failed!",
                };
            } else {
                return {
                    status: true,
                    message: "Password updated successfully!",
                };
            }
        } catch (error) {
            throw error;
        }
    },

    changeEmail: async (oldEmail, newEmail, userId) => {
        try {
            const exUser = await userRepository.getUserById(userId);
            if (!exUser) {
                return {
                    status: false,
                    message: "User not found",
                };
            }
            const emailMatch = (oldEmail === exUser[0].email);
            if (!emailMatch) {
                return {
                    status: false,
                    message: "Email does not match!",
                };
            }

            let dataToUpdate = { userId, oldEmail, newEmail };
            if (!userService.validatorEmail(newEmail)) {
                return {
                    status: false,
                    message: "Email is invalid!"
                };
            }
            const result = await userRepository.changeEmail(dataToUpdate);
            if (!result) {
                return {
                    status: false,
                    message: "Email update failed!",
                };
            }
            const updatedUser = await userRepository.getUserById(userId);
            return {
                status: true,
                message: "User email updated successfully",
                data: updatedUser,
            };


        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    changeName: async (oldName, newName, userId) => {
        try {
            const exUser = await userRepository.getUserById(userId);
            if (!exUser) {
                return {
                    status: false,
                    message: "User not found",
                };
            }
            const nameMatch = (oldName === exUser[0].name);
            if (!nameMatch) {
                return {
                    status: false,
                    message: "Name does not match!",
                };
            }

            let dataToUpdate = { userId, oldName, newName };

            const result = await userRepository.changeName(dataToUpdate);
            if (!result) {
                return {
                    status: false,
                    message: "Name update failed!",
                };
            }
            const updatedUser = await userRepository.getUserById(userId);
            return {
                status: true,
                message: "User Name updated successfully",
                data: updatedUser,
            };


        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    getUserById: async (userId) => {
        try {
            const result = await userRepository.getUserById(userId);
            if (result) {
                return {
                    status: true,
                    message: "User found successfully",
                    data: result,
                };
            }
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const result = await userRepository.getAllUsers();
            return {
                status: true,
                message: "Users fetched successfully",
                data: result,
            };
        } catch (error) {
            return {
                status: false,
                message: error,
                data: "Error regarding fetching users",
            };
        }
    },

    updateUser: async (userId, name, email, password) => {
        try {
            const result = await userRepository.getUserById(userId);
            if (!result) {
                return {
                    status: false,
                    message: "User not found",
                };
            }
            const emailMatch = (email === result[0].email);
            if (!emailMatch) {
                return {
                    status: false,
                    message: "Email does not match!",
                };
            }


            let dataToUpdate = { userId, name, email, password };

            if (!userService.validatorEmail(email)) {
                return {
                    status: false,
                    message: "Email is invalid!"
                };
            }
            const user = await userRepository.updateUser(dataToUpdate);
            if (!user) {
                return {
                    status: false,
                    message: "Email update failed!",
                };
            }
            const updatedUser = await userRepository.getUserById(userId);

            return {
                status: true,
                message: "User updated successfully",
                data: updatedUser,
            };


        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    deleteUser: async (id) => {
        try {

            const user = await userRepository.getUserById(id);

            if (!user) {
                return {
                    status: false,
                    message: "User not found",
                }
            }
            const result = await userRepository.deleteUser(id);
            if (result > 0) {
                return {
                    status: true,
                    message: "User deleted successfully",
                    data: result
                }
            } else {
                return {
                    status: false,
                    message: "User delete failed",
                }
            }
        } catch (error) {
            return {
                status: false,
                message: console.log(error),
                data: "Error regarding user deletion",
            };
        }
    }
};

export default userService;