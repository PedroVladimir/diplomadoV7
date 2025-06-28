function validate(schemna, target = 'body') {
    return (req, res, next) => {
        const data = req[target];

        if(!data || Object.keys(data).lenght === 0) {
            return res.status(400).json({ message : 'No data found' });
        }

    const { error, value } = schemna.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return res.status(400).json({
            message: `Erro de validación en ${target}`,
            errores: error.details.map(err => err.message),
        });
    }

    req[target] = value;
    next();

    }
}

export default validate;