import usersModel from "../models/users.model.js";

class UserManagerMongo {
    async getUsers(){
        return await usersModel.find({})
    }

    async getUser(uid){
        return await usersModel.findOne({_id: uid})
    }

    async getUserBy(field, value) {
        let filter = {};
        filter[field] = value;
        return await usersModel.find(filter);
    }
    async createUsers(newUser){
        return await usersModel.create(newUser)
    }

    async updateUser(uid){
        return await usersModel.updateOne({_id: uid})
    }
    
    async deleteUser(uid){
        return await usersModel.deleteOne({_id: uid})
    }
}
export default UserManagerMongo