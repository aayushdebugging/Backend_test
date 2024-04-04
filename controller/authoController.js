import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    const { name, email, password } = req.body
    //validate
    // if (!name) {
    //     next("name is required");
    // }
    // if (!email) {
    //     next("email is required");
    // }
    // if (!password) {
    //     next("password is required and should be greater then 6 characters");
    // }
    // const existingUser = await userModel.findOne({ email })
    // if (existingUser) {
    //     return res.status(200).send({
    //         sucess: false,
    //         message: 'Email Already Registered Please Login'
    //     });
    // }
    const user = await userModel.create({ name, email, password });
    //token
    const token = user.createJWT()
    res.status(201).send({
        sucess: true,
        message: "User Created Sucessfully",
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location

        },
        token,

    });
};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body
    //validation
    if (!email || !password) {
        next('Please Provide All Fields')
    }
    //find user by email
    const user = await userModel.findOne({ email }).select("+password") //hiding password
    if (!user) {
        next('Invalid Username or Password')
    }
    //compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        next('Invalid Username or Password')
    }
    user.password = undefined; //password hide
    const token = user.createJWT();
    res.status(200).json({
        sucess: true,
        message: "Login Sucessfully",
        user,
        token,
    })

};