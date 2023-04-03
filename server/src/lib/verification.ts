// create verification code with combination of small and capital letters and numbers
const verificationCode = async () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let code = "";
    for (let i = 0; i < 6; i++) {
        const rnum = Math.floor(Math.random() * chars.length);
        code += chars.substring(rnum, rnum + 1);
    }
    console.log("Verification code: " + code);
    return code;
};

export default verificationCode