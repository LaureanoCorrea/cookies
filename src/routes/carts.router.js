import { Router } from 'express';
import cartsModel from '../dao/models/carts.model.js';

const cartsRouter = Router();

cartsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartsModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'El carrito especificado no existe',
            });
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
        });
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        const newCart = await cartsModel.create({ products });
        
        res.status(201).json({
            status: 'success',
            message: 'Carrito agregado exitosamente "vacio"',
            cart: newCart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
        });
    }
});

cartsRouter.post('/:pid', async (req, res) => {
	try {
		const { pid } = req.params;
		const productId = pid;
		const quantity  = req.body;

		const cart = await cartsModel.findById({_id :'65c0f0df10e4268c77ed06b7'});
		if (!cart) {
			return res.status(404).json({
				status: 'error',
				message: 'El carrito especificado no existe',
			});
		}

		const productToAdd = {
			productId,
			quantity,
		};

		cart.products.push(productToAdd);
		const updatedCart = await cart.save();
		res.render('cart', { cart: updatedCart });

	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 'error',
			message: 'Error interno del servidor',
		});
	}
});

cartsRouter.delete('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await cartsModel.findById(cid);

		if (!cart) {
			return res.status(404).json({
				status: 'error',
				message: 'El carrito solicitado no existe',
			});
		}

		cart.products = [];
		await cart.save();

		res.status(200).json({
			status: 'success',
			message: `El carrito ${cid} ha sido vaciado`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 'error',
			message: 'Error interno del servidor',
		});
	}
});

cartsRouter.put('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;

		const updatedCart = await cartsModel.findByIdAndUpdate(
			cid,
			{ products },
			{ new: true }
		);

		if (!updatedCart) {
			return res.status(404).json({
				status: 'error',
				message: 'El carrito solicitado no existe',
			});
		}

		res.status(200).json({
			status: 'success',
			message: `El carrito ${cid} ha sido actualizado`,
			cart: updatedCart,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 'error',
			message: 'Error interno del servidor',
		});
	}
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		const cart = await cartsModel.findById(cid);

		if (!cart) {
			return res.status(404).json({
				status: 'error',
				message: 'El carrito solicitado no existe',
			});
		}

		const productIndex = cart.products.findIndex(
			(item) => item.product.toString() === pid
		);

		if (productIndex === -1) {
			return res.status(404).json({
				status: 'error',
				message: 'El producto no existe en el carrito',
			});
		}

		cart.products[productIndex].quantity = quantity;
		await cart.save();

		res.status(200).json({
			status: 'success',
			message: 'Cantidad de ejemplares actualizada con éxito',
			cart,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 'error',
			message: 'Error interno del servidor',
		});
	}
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const cart = await cartsModel.findById(cid);

		if (!cart) {
			return res.status(404).json({
				status: 'error',
				message: 'El carrito solicitado no existe',
			});
		}

		cart.products = cart.products.filter(
			(item) => item.product.toString() !== pid
		);
		await cart.save();

		res.status(200).json({
			status: 'success',
			message: 'Producto eliminado del carrito con éxito',
			cart,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 'error',
			message: 'Error interno del servidor',
		});
	}
});

export default cartsRouter;
