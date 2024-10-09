

// For successful responses
export const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

// For error responses
export const errorResponse = (res, message = 'Error', statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
};



