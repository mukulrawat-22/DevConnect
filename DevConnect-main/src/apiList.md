#devtinder



authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
PATCH /profile/edit
PATCH /profile/password


connectionrequestrouter
POST /request/send/interested/userId
POST /request/send/ignored/userId


POST /request/review/accpeted/requestID
POST /request/review/rejected/requestID


user connection
GET /connection
GET .request/received


status: ignore , interested ,accpeted, rejected


 