import { Router, json } from 'express';
import { getHealth } from '../controllers/healthController';
import { getGroups, getGroupById, createGroup, updateGroupSettings } from '../controllers/groupController';
import { getLogs, createLog } from '../controllers/logController';
import { getUsers, updateUser } from '../controllers/userController';

const router = Router();

// Middleware to parse JSON inside the router
router.use(json());

// Health route
router.get('/health', getHealth);

// Groups routes
router.get('/groups', getGroups);
router.get('/groups/:id', getGroupById);
router.post('/groups', createGroup);
router.put('/groups/:id/settings', updateGroupSettings);

// Logs routes
router.get('/logs', getLogs);
router.post('/logs', createLog);

// Users routes
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

export default router;
