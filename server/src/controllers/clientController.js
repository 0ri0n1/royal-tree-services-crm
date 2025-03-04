const Client = require('../models/clientModel');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Client.find(JSON.parse(queryStr));
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    // Execute query
    const clients = await query;
    
    // Send response
    res.status(200).json({
      status: 'success',
      results: clients.length,
      data: {
        clients
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get client by ID
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'No client found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    // Add user ID to client data
    req.body.createdBy = req.user.id;
    req.body.lastModifiedBy = req.user.id;
    
    const newClient = await Client.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        client: newClient
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    // Add user ID to lastModifiedBy
    req.body.lastModifiedBy = req.user.id;
    req.body.updatedAt = Date.now();
    
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'No client found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'No client found with that ID'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Add note to client
exports.addClientNote = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'No client found with that ID'
      });
    }
    
    const note = {
      content: req.body.content,
      createdBy: req.user.id
    };
    
    client.notes.push(note);
    client.lastModifiedBy = req.user.id;
    client.updatedAt = Date.now();
    
    await client.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Add service to client
exports.addClientService = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'No client found with that ID'
      });
    }
    
    const service = {
      ...req.body,
      createdBy: req.user.id
    };
    
    client.services.push(service);
    client.lastModifiedBy = req.user.id;
    client.updatedAt = Date.now();
    
    await client.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Add document to client
exports.addClientDocument = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'No client found with that ID'
      });
    }
    
    const document = {
      ...req.body,
      uploadedBy: req.user.id
    };
    
    client.documents.push(document);
    client.lastModifiedBy = req.user.id;
    client.updatedAt = Date.now();
    
    await client.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}; 