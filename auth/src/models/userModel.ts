import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttributes {
  email: string;
  password: string;
}

// An interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

// An interface that describes the properties that a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  updatedAt: string;
  createdAt: string;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

UserSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

const user = User.build({
  email: 'test@gmail.com',
  password: 'password',
});

export { User };
