import pino from 'pino';

const looger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime : 'SYS:standard',
        },
    }
});

export default looger;