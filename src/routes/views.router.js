import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import usersModel from "../dao/models/users.model.js";
import cartsModel from "../dao/models/carts.model.js";

const router = Router()

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort='', query = '' } = req.query;
    
    try {
        const options = {
            limit,
            page,
            sort: sort || {},
            query,
            lean: true
        };

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page: currentPage
        } = await productsModel.paginate({}, options);

        res.render("products", {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page: currentPage,
            style: 'index.css'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/chat', (req, res) => {
    res.render('chat', {
        style: 'index.css'
    })
})

router.get('/realtimeproducts', async (req, res) => {

    try {
        const products = await productsModel.find({})
        res.render('realTimeProducts', {
            productos: products,
            style: 'index.css'
        })

    } catch (error) {
        console.log(error);
        res.json("Error al intentar obtener la lista de productos!");
        return;
    }
})

router.get('/productDetails/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const product = await productsModel.findById(pid).lean()
        res.render('productDetails', {
            product,
            style: 'index.css'
        })
    } catch (error) {
        console.log(error);
        res.json("Error al intentar obtener el producto!");
        return;
    }
})

router.post('/', async (req, res) => {
    try {
        const products = await productsModel.find({})
        res.render('realTimeProducts', {
            productos: products,
            style: 'index.css'
        })
    } catch (error) {
        console.log(error);
        res.render("Error al intentar obtener la lista de productos!");
        return;
    }
})

// router.get('/cart/:cid', async (req, res) => {
//     try {
//         const cid = '65c0f0df10e4268c77ed06b7';
//         const carts = await cartsModel.find({cid})
//         res.render('cart', {
//             carts,
//             style: 'index.css'
//         })
//     } catch (error) {
//         console.log(error);
//         res.render("Error al intentar obtener la lista de carritos!");
//         return;
//     }
// })


export default router