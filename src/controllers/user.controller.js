import { User } from '../models/user.js';
import { encriptar } from '../common/bcrypt.js';
import { Task } from '../models/task.js';
import { Op } from 'sequelize';


async function getUsers(req, res, next) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            // where: {
            //     status: 'active',
            // }
        });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

async function getUser(req, res, next) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username', 'password', 'status'],
            where: {
                id,
            }
        });

        if(!user) {
            res.status(404).json({ message: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        next(error);
    }

}

async function updateUser(req, res, next) {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        if (!username && !password) {
            return res.status(400).json({ message: 'Username or password is required' });
        }

        const passwordEncriptado = await encriptar(password);

        const user = await User.update({
            username,
            password : passwordEncriptado
        }, {
            where: {
                id,
            },
        });
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    const { id } = req.params;
    try {
        await User.destroy({
            where: {
                id,
            },
        }); 

        res.json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
}

async function activateInactivate(req, res, next) {
    const { id } = req.params;  
    const { status } = req.body;
    try {
        if (!status) {
            res.status(400).json({ message: 'Status is required' });
        }

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        if(user.status === status) {
            res.status(409).json({ message: `Same status` });
        }

        user.status = status;
        await user.save();
        res.json(user);
        
    } catch (error) {
        next(error);
    }
}

async function getTasks(req, res, next) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            include: [
                {
                    model: Task,
                    attributes: ['name', 'done'],
                    where: {
                        done : false
                    }
                }
            ],
            where: {
                id
            }
        });
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function getUsersPagination(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const orderBy = req.query.orderBy || 'id';
        const orderDir = req.query.orderDir || 'DESC';
    

        const validLimits = [5, 10, 15, 20];
        const validOrderBy = ['id', 'username', 'status'];
        const validOrderDir = ['ASC', 'DESC'];
    
        if (!validLimits.includes(limit)) {
            return res.status(400).json({ error: 'Invalid limit value' });
        }
    
        if (!validOrderBy.includes(orderBy)) {
            return res.status(400).json({ error: 'Invalid orderBy value' });
        }
        
        if (!validOrderDir.includes(orderDir)) {
            return res.status(400).json({ error: 'Invalid orderDir value' });
        }

        const whereCondition = {};
        if (search) {
            whereCondition.username = {
                [Op.iLike]: `%${search}%`
            };
        }

        // Calcular offset para paginación
        const offset = (page - 1) * limit;

        // Consulta a la base de datos
        const { count, rows } = await User.findAndCountAll({
            where: whereCondition, 
            limit: limit,
            offset: offset,
            order: [[orderBy, orderDir]],
            attributes: ['id', 'username', 'status'] // Solo devolver estos campos
        });

        // Calcular total de páginas
        const totalPages = Math.ceil(count / limit);

        // Preparar respuesta
        const response = {
            total: count,
            page: page,
            pages: totalPages,
            data: rows
        };

        res.json(response);
    } catch (error) {
        next(error);
    }

}


export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactivate,
    getTasks,
    getUsersPagination
};