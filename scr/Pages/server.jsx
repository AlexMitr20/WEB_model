const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'vadev',
    host: 'localhost',
    database: 'epos',
    password: '12345',
    port: 9512
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM vacancy.users WHERE login = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.status(200).json({ message: 'Вход выполнен успешно', userId: user.id_user, username: user.login }); // Возвращаем id_user и логин
        } else {
            res.status(401).json({ message: 'Неправильный логин или пароль' });
        }
    } catch (err) {
        console.error('Ошибка сервера при входе', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM vacancy.users WHERE login = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Такой пользователь уже существует' });
        }
        const newUser = await pool.query('INSERT INTO vacancy.users (login, password) VALUES ($1, $2) RETURNING id_user', [username, password]);
        const userId = newUser.rows[0].id_user;
        res.status(201).json({ message: 'Пользователь зарегистрирован успешно', userId: userId });
    } catch (err) {
        console.error('Ошибка сервера при регистрации', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/requirements', async (req, res) => {
    try {
        const result = await pool.query('SELECT name, applicant_requirement_id FROM vacancy."1 applicantrequirement"');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/parameters/:requirementId', async (req, res) => {
    const requirementId = req.params.requirementId;
    try {
        const result = await pool.query(`
            SELECT arp.requirement_parameter_id, rp.name
            FROM vacancy."4 applicantrequirementparameter" arp
            JOIN vacancy."2 requirementparameter" rp ON arp.requirement_parameter_id = rp.requirement_parameter_id
            WHERE arp.applicant_requirement_id = $1
        `, [requirementId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/parametersload/:parameterId', async (req, res) => {
    const parameterId = req.params.parameterId;
    try {
        const result = await pool.query(`
            SELECT name
            FROM vacancy."2 requirementparameter"             
            WHERE requirement_parameter_id = $1
        `, [parameterId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Ошибка сервера');
    }
});


app.get('/requirements/:requirementId', async (req, res) => {
    const requirementId = req.params.requirementId;
    try {
        const result = await pool.query(`
            SELECT name
            FROM vacancy."1 applicantrequirement"
            WHERE applicant_requirement_id = $1
        `, [requirementId]);
        
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Требование не найдено');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/skill', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM vacancy."8 scale"');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/Criteria/:CriteriaId', async (req, res) => {
    const CriteriaId = req.params.CriteriaId;
    try {
        const result = await pool.query(`
            SELECT value 
            FROM vacancy."9 requirement_parameter_values"
            WHERE id = $1
            `, [CriteriaId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/skillload/:skillAssessmentId', async (req, res) => {
    const skillAssessmentId = req.params.skillAssessmentId;
    try {
        const result = await pool.query(`
            SELECT name 
            FROM vacancy."8 scale"
            WHERE id = $1
            `, [skillAssessmentId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/skill/:skillAssessmentId', async (req, res) => {
    const skillAssessmentId = req.params.skillAssessmentId;
    try {
        const result = await pool.query(`
            SELECT rp.id, rp.value
            FROM vacancy."9 requirement_parameter_values" rp
            JOIN vacancy."7 parameter_of_scales" ps ON rp.id = ps.parameter_id
            WHERE ps.scale_id = $1
        `, [skillAssessmentId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});


app.post('/save-project', async (req, res) => {
    const { userId, name, requirements, parameters, skillAssessments, criteria } = req.body;
    
    try {
        // Начинаем транзакцию
        await pool.query('BEGIN');

        // Сохраняем проект в таблицу 2pr
        const projectResult = await pool.query(
            'INSERT INTO vacancy."2pr" (id_user, name) VALUES ($1, $2) RETURNING id_proj',
            [userId, name]
        );
        const projectId = projectResult.rows[0].id_proj;

        console.log('Проект сохранен с ID:', projectId);

        // Сохраняем выбранные параметры в таблицу para
        for (const paramId of parameters) {
            await pool.query(
                'INSERT INTO vacancy."para" (id_proj, requirement_parameter_id) VALUES ($1, $2)',
                [projectId, paramId]
            );
            console.log('Сохранен параметр с ID:', paramId);
        }

        // Сохраняем выбранные требования в таблицу requir
        for (const reqId of requirements) {
            await pool.query(
                'INSERT INTO vacancy."requir" (id_proj, applicant_requirement_id) VALUES ($1, $2)',
                [projectId, reqId]
            );
            console.log('Сохранено требование с ID:', reqId);
        }

        // Сохраняем выбранные оценки в таблицу scales
        for (const assessmentId of skillAssessments) {
            await pool.query(
                'INSERT INTO vacancy.scales (id_proj, id_scale) VALUES ($1, $2)',
                [projectId, assessmentId]
            );
            console.log('Сохранена оценка с ID:', assessmentId);
        }

        // Сохраняем выбранные критерии в таблицу values
        for (const criterionId of criteria) {
            await pool.query(
                'INSERT INTO vacancy.values (id_proj, value) VALUES ($1, $2)',
                [projectId, criterionId]
            );
            console.log('Сохранен критерий с ID:', criterionId);
        }

        await pool.query('COMMIT');

        console.log('Проект успешно сохранен');
        res.status(200).json({ message: 'Проект успешно сохранен' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Ошибка при сохранении проекта:', err);
        res.status(500).send('Ошибка при сохранении проекта');
    }
});

app.get('/project/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const projectsResult = await pool.query('SELECT id_proj, name FROM vacancy."2pr" WHERE id_user = $1', [userId]);
        const projects = projectsResult.rows;

        res.status(200).json(projects);
    } catch (err) {
        console.error('Ошибка при получении данных проекта:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/project/:userId/:projectId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const projectId = parseInt(req.params.projectId, 10);

    if (isNaN(userId) || isNaN(projectId)) {
        return res.status(400).send('Invalid user or project ID');
    }

    try {
        const projectResult = await pool.query(`
            SELECT id_proj, name 
            FROM vacancy."2pr" 
            WHERE id_user = $1 AND id_proj = $2
        `, [userId, projectId]);

        const project = projectResult.rows[0];

        const requirementsResult = await pool.query(`
            SELECT applicant_requirement_id
            FROM vacancy.requir
            WHERE id_proj = $1
        `, [projectId]);
        const requirements = requirementsResult.rows;

        const parametersResult = await pool.query(`
            SELECT requirement_parameter_id
            FROM vacancy.para
            WHERE id_proj = $1
        `, [projectId]);
        const parameters = parametersResult.rows;

        const skillAssessmentsResult = await pool.query(`
            SELECT id_scale
            FROM vacancy.scales
            WHERE id_proj = $1
        `, [projectId]);
        const skillAssessments = skillAssessmentsResult.rows;

        const criteriaResult = await pool.query(`
            SELECT value
            FROM vacancy.values
            WHERE id_proj = $1
        `, [projectId]);
        const criteria = criteriaResult.rows;

        const projectData = {
            id_proj: projectId,
            name: project?.name || 'Unknown Project',
            requirements,
            parameters,
            skillAssessments,
            criteria
        };

        res.status(200).json(projectData);
    } catch (err) {
        console.error('Ошибка при получении данных проекта:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/project12/:userId/:projectId', async (req, res) => {
    const userId = req.params.userId;
    const projectId = req.params.projectId;

    try {
        const projectResult = await pool.query(`
            SELECT id_proj, name 
            FROM vacancy."2pr" 
            WHERE id_user = $1 AND id_proj = $2
        `, [userId, projectId]);

        const project = projectResult.rows[0];

        const requirementsResult = await pool.query(`
            SELECT "2 requirementparameter".name
            FROM vacancy."2 requirementparameter"
            JOIN vacancy.para ON para.requirement_parameter_id = "2 requirementparameter".requirement_parameter_id
            WHERE para.id_proj = $1
        `, [projectId]);
         const requirements = requirementsResult;

        const projectData = {
            id_proj: projectId,
            name: project?.name || 'Unknown Project',
            requirements            
        };

        res.status(200).json(projectData);
    } catch (err) {
        console.error('Ошибка при получении данных проекта:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
