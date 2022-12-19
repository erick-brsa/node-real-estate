import express from 'express';
import { admin, createProperty } from '../controllers/estateController.js'

const router = express.Router();

router.get('/admin', admin);

router.get('/create', createProperty);

export default router;
