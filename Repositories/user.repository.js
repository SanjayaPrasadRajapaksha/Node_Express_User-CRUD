import sequelize from "../Configs/db.config.js";
import User from "../Models/user.model.js";
import bcrypt from "bcrypt";

const userRepository = {

    async registerUser(name, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    async checkUser(email) {
        const existingUser = await User.findOne({ where: { email } });
        return existingUser ? true : false;
    },
 
    async getUserByEmailForLogin(email) {
        try {
            const user = await User.findOne({
                where: { email: email },
            });

            return user;
        } catch (error) {
            throw error;
        }

    },

    getUserById: async (userId) => {
        try {
            const result = await User.findAll({
                where: {
                    id: userId,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    changeUserPassword: async (userId, newPasswordHash) => {
        try {
            await sequelize.sync();
            const result = await User.update(
                {
                    password: newPasswordHash,
                },
                {
                    where: {
                        id: userId,
                    },
                }
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    changeEmail: async (values) => {
        try {
            const result = await User.update({
                email: values.newEmail,
            }, {
                where: {
                    id: values.userId,
                },
            });
            return result;

        } catch (error) {
            throw error;
        }
    },

    changeName: async (values) => {
        try {
            const result = await User.update({
                name: values.newName,
            }, {
                where: {
                    id: values.userId,
                },
            });
            return result;

        } catch (error) {
            throw error;
        }
    },

    async getAllUsers() {
        try {
            const result = await User.findAll();
            return result;
        } catch (error) {
            throw error;
        }
    },

    async updateUser(values) {
        try {
            const hashedPassword = await bcrypt.hash(values.password, 10);
            const result = await User.update({
                name: values.name,
                email: values.email,
                password: hashedPassword,
            }, {
                where: {
                    id: values.userId,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            const result = await User.destroy({
                where: {
                    id: id,
                }
            })
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default userRepository;