import model from "../models/users";

// User controller
// Use Promises
const UserController = {
    // Get all users
    getUsers: async (req: any, res: any) => {
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

    // Insert a new user
    insertUser: (body: any) => {
        return new Promise((resolve: any, reject: any) => {
            console.log("asasas", body);
            // model.create(req.body)
            //     .then((data: any) => {
            //         res.send({ data: data });
            //         resolve(data);
            //     })
            //     .catch((err: any) => {
            //         res.send(err);
            //         reject(err);
            //     });
        })
    }
}

export default UserController;