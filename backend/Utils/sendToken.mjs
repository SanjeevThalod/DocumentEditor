const sendToken = async (User,statusCode,res)=>{
    try {
        
        const token = User.generateAuthToken();

        res.status(statusCode).json({"Success":true, token:token, User});
    } catch (error) {
        res.status(400).json({success:false,error});
    }
}

export default sendToken;