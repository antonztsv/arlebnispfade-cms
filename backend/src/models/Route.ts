import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    pois: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model('Route', RouteSchema);
