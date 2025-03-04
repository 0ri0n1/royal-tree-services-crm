const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A client must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A client must have an email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'A client must have a phone number']
  },
  address: {
    type: String,
    required: [true, 'A client must have an address']
  },
  serviceNeeds: {
    type: String,
    trim: true
  },
  locationDetails: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Quote', 'Active', 'Completed', 'Inactive'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  inquiryDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A client must belong to a user']
  },
  lastModifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  notes: [
    {
      content: {
        type: String,
        required: [true, 'A note must have content']
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A note must belong to a user']
      }
    }
  ],
  services: [
    {
      type: {
        type: String,
        required: [true, 'A service must have a type']
      },
      description: {
        type: String,
        required: [true, 'A service must have a description']
      },
      date: {
        type: Date,
        required: [true, 'A service must have a date']
      },
      cost: {
        type: Number
      },
      status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
      },
      createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A service must belong to a user']
      }
    }
  ],
  documents: [
    {
      name: {
        type: String,
        required: [true, 'A document must have a name']
      },
      fileUrl: {
        type: String,
        required: [true, 'A document must have a file URL']
      },
      fileType: {
        type: String
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A document must belong to a user']
      }
    }
  ]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
clientSchema.index({ name: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ priority: 1 });
clientSchema.index({ createdBy: 1 });

// Pre-save middleware to update the updatedAt field
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-find middleware to populate the createdBy field
clientSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'createdBy',
    select: 'name email'
  });
  next();
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client; 