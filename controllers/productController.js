/**
 * Controller para manejar productos
 */

import pool from '../config/db.js';

/**
 * Obtiene información del producto, cliente y SLA basado en un barcode e imagen
 * @param {Object} req - Request object de Express (espera barcode de 8 dígitos e image en base64)
 * @param {Object} res - Response object de Express
 */
export const handleAlcohol = async (req, res) => {
    try {
        const { barcode, image } = req.body;

        // Validaciones del barcode
        if (!barcode) {
            return res.status(400).json({
                status: 'error',
                message: 'El campo barcode es requerido',
                code: 'BARCODE_REQUIRED'
            });
        }

        if (typeof barcode !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'El barcode debe ser una cadena de texto',
                code: 'BARCODE_INVALID_TYPE'
            });
        }

        if (barcode.trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'El barcode no puede estar vacío',
                code: 'BARCODE_EMPTY'
            });
        }

        // Validar que el barcode tenga exactamente 8 dígitos numéricos
        const barcodeRegex = /^\d{8}$/;
        if (!barcodeRegex.test(barcode)) {
            return res.status(400).json({
                status: 'error',
                message: 'El barcode debe ser exactamente de 8 dígitos numéricos',
                code: 'BARCODE_INVALID_FORMAT'
            });
        }

        // Validaciones de la imagen
        if (!image) {
            return res.status(400).json({
                status: 'error',
                message: 'El campo image es requerido',
                code: 'IMAGE_REQUIRED'
            });
        }

        if (typeof image !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'La imagen debe ser una cadena de texto en base64',
                code: 'IMAGE_INVALID_TYPE'
            });
        }

        // Validar formato base64
        const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
        if (!base64Regex.test(image)) {
            return res.status(400).json({
                status: 'error',
                message: 'La imagen debe estar en formato base64 válido (data:image/...;base64,...)',
                code: 'IMAGE_INVALID_FORMAT'
            });
        }

        // Consultar información del producto, cliente y SLA
        const query = `
            SELECT
                p.product_name,
                p.bottle_size,
                c.customer_name,
                s.policy_text as sla
            FROM product p
            LEFT JOIN inspection_record ir ON p.product_id = ir.product_id
            LEFT JOIN customer c ON ir.customer_code = c.customer_code
            LEFT JOIN sla_policy s ON ir.policy_id = s.policy_id
            WHERE p.barcode = $1
            LIMIT 1
        `;

        const result = await pool.query(query, [barcode]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'El producto con el barcode proporcionado no existe en la base de datos',
                code: 'BARCODE_NOT_FOUND'
            });
        }

        const productInfo = result.rows[0];

        // Retornar la información del producto
        return res.status(200).json({
            status: 'success',
            barcode: barcode,
            product_name: productInfo.product_name,
            bottle_size: productInfo.bottle_size,
            customer_name: productInfo.customer_name || null,
            sla: productInfo.sla || null
        });

    } catch (error) {
        console.error('Error en handleAlcohol:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
            details: error.message
        });
    }
};
