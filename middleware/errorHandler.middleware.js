import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

const ErrorHandler = (err,req,res,next) => {
    console.error(err)
    let errStatus = err.status || 500
    let errMsg = err.message || "Internal Server Error"
    let errStack = err.stack || "No stack trace available"
    let errDetails = null

    if(err instanceof Prisma.PrismaClientKnownRequestError) {
            errStatus = 400
            errMsg = "Unique constraint failed"
            errDetails = {
                field: err.meta?.target,
                message: "Prisma error",
                code: err.code,
            }
    }

    if(err instanceof ZodError) {
        errStatus = 400
        errMsg = "Validation error"

        errDetails = err.errors.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
            type: issue.type
        }))
    }

    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        errors: errDetails,
        stack: process.env.NODE_ENV === "development" ? errStack : {},
    })
}

export default ErrorHandler