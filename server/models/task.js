import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'completed'],
    default: 'to-do',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // This should match the user ID type
    required: true, // Ensure that each task is associated with a user
    ref: 'User', // Reference to the User model if you have one
  },
});

// Export the Task model
const Task = mongoose.model('Task', taskSchema);
export default Task;
