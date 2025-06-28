import bcrypt from 'bcrypt';
import config from '../config/env.js';
import looger from '../logs/logger.js';

export const encriptar = async (texto) => {
    try {
        const salt = config.BCRYPT_SALT_ROUNDS;
        const hash = await bcrypt.hash(texto, salt);
        return hash;
    } catch (error) {
        looger.error(error)
        throw new Error('Error al encriptar la contraseña');
    }
};

export const comparar = async (texto, hash) => {
    try {
        return await bcrypt.compare(texto, hash)
    } catch (error) {
        looger.error(error);
        throw new Error('Error al comparar la contraseña');
    }
}