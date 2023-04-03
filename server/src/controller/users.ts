import model from "../models/users";
import { Hash } from "../lib/passport";
import { sendApprovalNotice, sendVerificationCode } from "../lib/email";

// User controller
// Use Promises
const UserController = {
    // Get all users
    getAllUsers: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.find({})
                .then((data: any) => {
                    res.send({ data: data });
                    resolve(data);
                })
                .catch((err: any) => {
                    res.send(err);
                    reject(err);
                });
        })
    },

    // Get a user
    getUser: (id: any, req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.find({ _id: id })
                .then((data: any) => {
                    res.send({ data: data });
                    resolve(data);
                })
                .catch((err: any) => {
                    res.send(err);
                    reject(err);
                });
        });
    },

    // Get user by email or username
    getUserByEmailOrUsername: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.find({ $or: [{ email: req.body.username }, { username: req.body.username }] })
                .then((data: any) => {
                    res.send({ data: data });
                    resolve(data);
                })
                .catch((err: any) => {
                    res.send(err);
                    reject(err);
                });
        });
    },

    // normal add user
    insertUser: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            // hash the password
            req.body.password = Hash(req.body.password);

            // send verification email
            req.body["verificationCode"] = sendVerificationCode(req.body.email);

            model.create(req.body)
                .then((data: any) => {
                    res.send({ message: "Data Inserted!", data: data });
                    console.log(data);
                    resolve(data);
                })
                .catch((err: any) => {
                    res.send(err);
                    console.log(err);
                    reject(err);
                });
        })
    },

    // Register a new user
    // username and email cannot duplicate in the database
    registerUser: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            // prevent duplicate username and email
            model.find({ $or: [{ email: req.body.email }, { username: req.body.username }] })
                .then(async (data: any) => {
                    if (data.length === 0) {
                        // check password and confirm password
                        if (req.body.password !== req.body.confirmPassword) {
                            res.send({ message: "Password and Confirm Password are not the same!" });
                        } else {

                            // hash the password
                            req.body.password = Hash(req.body.password);

                            // use send email function to send verification code and store code into req.body
                            req.body["verificationCode"] = await sendVerificationCode(req.body.email);

                            model.create(req.body)
                                .then((user: any) => {
                                    res.send({ message: "Data Inserted!", data: user });
                                    console.log(data);
                                    resolve(data);
                                })
                                .catch((err: any) => {
                                    res.send(err);
                                    console.log(err);
                                    reject(err);
                                });
                        }
                    } else {
                        res.send({ message: "Username or Email already exists!" });
                    }
                })
                .catch((err: any) => {
                    res.send(err);
                    console.log(err);
                    reject(err);
                });
        })
    },

    // Verify a user
    verifyUser: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.findOne({ email: req.body.email })
                .then((data: any) => {
                    if (data.verificationCode === req.body.verificationCode) {
                        // update verification status to true
                        model.findOneAndUpdate({ _id: data._id }, { verified: true }, { new: true })
                            .then((user: any) => {
                                // find admins and send approval notice email to them
                                model.find({ role: "admin" })
                                    .then((data: any) => {
                                        data.forEach((admin: any) => {
                                            sendApprovalNotice(admin.email, user);
                                        });
                                    })
                                    .catch((err: any) => {
                                        console.log(err);
                                    });
                                console.log(data);
                                res.send({ message: "User verified!", data: user });
                            })
                            .catch((err: any) => {
                                console.log(err);
                                res.send(err);
                            });

                    } else {
                        res.send({ message: "Verification code is incorrect!" });
                    }
                })
                .catch((err: any) => {
                    res.send(err);
                    console.log(err);
                    reject(err);
                });
        })
    },

    // Update a user
    updateUser: (id: any, req: any, res: any) => {
        // Create a function that waits for req.body.password to be set
        const update = () => {
            return new Promise((resolve: any, reject: any) => {
                req.body["lastEdit"] = Date.now();
                model.findOneAndUpdate({ _id: id }, req.body, { new: true })
                    .then((data: any) => {
                        console.log(req.body);
                        // wait for update to complete before sending response
                        res.send({ message: "Data Updated!", data: data });
                        // console.log(data);
                        resolve(data);
                    })
                    .catch((err: any) => {
                        res.send(err);
                        console.log(err);
                        reject(err);
                    });
            });
        }

        if (req.body?.password) {
            const oldPassword = Hash(req.body.password);
            model.findOne({ _id: id }).then((data: any) => {
                if (data.password === oldPassword && req.body.newPassword === req.body.confirmPassword) {
                    req.body["password"] = Hash(req.body.newPassword);
                    update();
                } else if (data.password !== oldPassword) {
                    res.send({ message: "Old password is incorrect!" });
                } else if (req.body.newPassword !== req.body.confirmPassword) {
                    res.send({ message: "New password and confirm password are not the same!" });
                }
            });
        } else {
            update();
        }
    },

    resetPassword: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            // check if email exists
            model.findOne({ email: req.body.email })
                .then(async (data: any) => {
                    if (data) {
                        // send verification code to email and update verification code in database
                        const code = await sendVerificationCode(req.body.email);
                        model.findOneAndUpdate({ email: req.body.email }, { verificationCode: code }, { new: true })
                            .then((data: any) => {
                                res.send({ message: "Verification code to reset password sent!", verificationCode: code, data: data });
                            })
                            .catch((err: any) => {
                                res.send(err);
                                console.log(err);
                                reject(err);
                            });
                    } else {
                        res.send({ message: "Email does not exist!" });
                    }
                })
                .catch((err: any) => {
                    res.send(err);
                    console.log(err);
                    reject(err);
                });
        })
    },

    // update password
    updatePassword: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            // check if verification code is correct
            model.findOne({ email: req.body.email })
                .then((data: any) => {
                    if (data) {
                        if (data.verificationCode === req.body.verificationCode) {
                            // check if password and confirm password are the same
                            if (req.body.password === req.body.confirmPassword) {
                                model.findOneAndUpdate({ email: req.body.email }, { password: Hash(req.body.password) }, { new: true })
                                    .then((data: any) => {
                                        res.send({ message: "Password updated!", data: data });
                                    })
                                    .catch((err: any) => {
                                        res.send(err);
                                        console.log(err);
                                        reject(err);
                                    }
                                    );
                            }
                            else {
                                res.send({ message: "Password and Confirm Password are not the same!" });
                            }
                        }
                        else {
                            res.send({ message: "Verification code is incorrect!" });
                        }
                    }
                })
                .catch((err: any) => {
                    res.send(err);
                    console.log(err);
                    reject(err);
                });
        })
    },

    // Delete a user
    deleteUser: (id: any, req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.deleteMany({ _id: id })
                .then(() => {
                    res.send({ message: "Data Deleted!" });
                    resolve();
                })
        });
    },

    // Delete many users
    deleteMany: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.deleteMany({ _id: { $in: req.body.ids } })
                .then(() => {
                    res.send({ message: "Data Deleted!" });
                    resolve();
                })
        });
    },

    // Approve user
    approveUser: (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            model.findOne({ email: req.body.email })
                .then((data: any) => {
                    if (data) {
                        model.findOneAndUpdate({ _id: data._id }, { approved: true }, { new: true })
                            .then((data: any) => {
                                console.log(data);
                                res.send({ message: "User approved!", data: data });
                            })
                            .catch((err: any) => {
                                console.log(err);
                                res.send(err);
                            });
                    } else {
                        res.send({ message: "Email does not exist!" });
                    }
                })
        });
    },
}

export default UserController;