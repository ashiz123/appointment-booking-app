export function responseHandler(res, result) {
    if (result.success) {
        return res.status(result.status).json({
            success: true,
            data: result.data || null,
            message: result.message || 'Success'
        });
    } else {
        return res.status(result.status).json({
            success: false,
            error: result.error || 'Something went wrong',
            message: result.message || 'Failed'
        });
    }
}