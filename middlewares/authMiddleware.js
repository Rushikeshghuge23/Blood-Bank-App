const JWT = require("jsonwebtoken");

module.exports = async (req,res,next) => {
    try{
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                return res.status(401).send({
                    success:false,
                    message: "Auth Failed",
                });
            }else{
                req.body.userId = decode.userId;
                next();
            }
        });
    }catch (error) {
        console.log(error);
        return res.status(401).send({
            success:false,
            error,
            message:"Auth Failed",
        });
    }
};


// const JWT = require("jsonwebtoken");

// module.exports = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader) {
//       return res.status(401).send({
//         success: false,
//         message: "Authorization header missing",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return res.status(401).send({
//         success: false,
//         message: "Token missing from authorization header",
//       });
//     }

//     JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         return res.status(401).send({
//           success: false,
//           message: "Auth Failed",
//         });
//       } else {
//         req.body.userId = decode.userId;
//         next();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(401).send({
//       success: false,
//       error,
//       message: "Auth Failed",
//     });
//   }
// };