import { Router } from 'express';
import auth from '../middleware/authentication.middleware.js';
import userManagerMongo from '../dao/Mongo/userManagerMongo.js';

const router = Router();
const sessionService = new userManagerMongo();

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
    console.log(email, password)

	const user = await sessionService.getUserBy({ email });
	if (!user) return res.status(401).json({ error: 'User or password invalid' });
	req.session.user = { id: user.id, username: user.first_name, admin: true };
	res.send('Login correcto');
});

router.post('/register', async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;
		if (email == '' || password == '')
			return res.send('Faltan Campos obligatorios');

		const newUser = {
			first_name,
			last_name,
			email,
			password,
		};
		const result = await sessionService.createUsers(newUser);

		res.send({ status: 'success', payload: newUser });
	} catch (error) {
		res.send({ status: 'error', error: error.message });
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) return res.send('Logout Error');
		res.send({ status: 'success', message: 'Logout Ok' });
	});
});

router.get('/current', auth, (req, res) => {
	res.send('<h1>datos sensibles</h1>');
});

export default router;
