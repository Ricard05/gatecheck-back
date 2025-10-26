/**
 * Controller para manejar el endpoint de hola mundo
 */

/**
 * Envía un mensaje de hola mundo
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export const sayHello = (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Hola mundo',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en sayHello:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar la solicitud',
            details: error.message
        });
    }
};
