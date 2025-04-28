import {Router} from 'express';
import { getAllMechanics, getMechanic } from '../controllers/admin.controller.js';

const router = Router();



router.get('/getall-mechanics', getAllMechanics); // 👈 Match this exactly!

router.get('/get-mechanic',getMechanic);


export default router;
