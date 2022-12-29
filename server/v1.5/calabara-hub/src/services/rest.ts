import express from 'express';
import organizations from './organizations/organizations.routes'
import dashboard from './dashboard/dashboard.routes'
import bodyParser from 'body-parser';

// rest endpoints

const router = express();
router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
router.use(express.json())
router.use('/organizations', organizations)
router.use('/dashboard', dashboard)

export default router