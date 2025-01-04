import { Router } from 'express';
import * as databaseController from '../controllers/database.controller';

const router = Router();

router.get('/tables', databaseController.getTables);
router.get('/tables/:table/data', databaseController.getTableData);

export default router;