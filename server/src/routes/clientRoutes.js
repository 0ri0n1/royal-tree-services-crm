const express = require('express');
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Client routes
router
  .route('/')
  .get(clientController.getAllClients)
  .post(clientController.createClient);

router
  .route('/:id')
  .get(clientController.getClient)
  .patch(clientController.updateClient)
  .delete(
    authController.restrictTo('admin', 'manager'),
    clientController.deleteClient
  );

// Client notes
router
  .route('/:id/notes')
  .post(clientController.addClientNote);

// Client services
router
  .route('/:id/services')
  .post(clientController.addClientService);

// Client documents
router
  .route('/:id/documents')
  .post(clientController.addClientDocument);

module.exports = router; 