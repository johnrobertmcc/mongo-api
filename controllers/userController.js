import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { DEFAULT_TAGS, DEFAULT_THEME } from '../utils/users/index.js';
const { genSalt, hash, compare } = bcrypt;
const { sign } = jwt;

/**
 * Function used to add a user to the database.
 *
 * @author John Robert McCann
 * @since  6/25/2022
 * @route  POST /api/v1/user
 * @access Public
 * @version 1.0.0
 * @param  {object} req  The request object.
 * @param  {object} res  The response object.
 */
export async function registerUser(req, res) {
  const { name = null, email = null, password = null } = req?.body;
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists.');
  }
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    tags: DEFAULT_TAGS,
    theme: DEFAULT_THEME,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      tags: user.tags,
      theme: user.theme,
      token: _generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data.');
  }
}

/**
 * Function used to login a user to the app.
 *
 * @author John Robert McCann
 * @since  6/25/2022
 * @route  POST /api/v1/user/login
 * @version 1.0.0
 * @access Public
 * @param  {object} req  The request object.
 * @param  {object} res  The response object.
 */
export async function loginUser(req, res) {
  const { email = null, password = null } = req?.body;

  if (!email || !password) {
    throw new Error('Try Again.', email, password);
  }

  const user = await User.findOne({ email });

  if (user && (await compare(password, user?.password))) {
    console.log(`${email} logged in!`);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      tags: user?.tags.length ? user.tags : DEFAULT_TAGS,
      token: _generateToken(user._id),
      theme: user?.theme || null,
    });
  } else {
    res.status(400);
    throw new Error('Invalid login data.');
  }
}

/**
 * Function used to get currently logged in user information.
 *
 * @author John Robert McCann
 * @since  6/25/2022
 * @route  GET /api/v1/user/me
 * @version 1.0.0
 * @access Private
 * @param  {object} req  The request object.
 * @param  {object} res  The response object.
 */
export async function getUser(req, res) {
  const { email = null } = req?.user;
  if (!email) {
    throw new Error('Try Again - missing email.');
  }

  const user = await User.findOne({ email });
  res.status(200).json({ message: 'User Information.', user });
}

/**
 * Function used to generate a token and validate on POST or GET request for /user.
 *
 * @author  John Robert McCann
 * @since   6/25/2022
 * @version 1.0.0
 * @access  Private
 * @param   {string}  id The id of the user to validate.
 * @returns {boolean}    Returns true or false.
 */
function _generateToken(id) {
  const token = sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return token;
}

/**
 * Function used to update a user in the database by id.
 *
 * @author John Robert McCann
 * @since  6/25/2022
 * @route  POST /api/v1/user/:id
 * @version 1.0.0
 * @access Private
 * @param {object} req  The request object.
 * @param {object} res  The response object.
 */
export async function updateUser(req, res) {
  console.log('jr req', req.body);
  const user = await User.updateOne(
    { _id: req?.body?.data?._id },
    req?.body?.data
  );
  return res.status(200).json({
    version: process.env.VERSION,
    goal: `Updated User ${new Date()}`,
    user,
  });
}

/**
 * Function used to delete a user in the database by id.
 *
 * @author John Robert McCann
 * @since 6/25/2022
 * @route POST /api/v1/user/:id
 * @version 1.0.0
 * @access Private
 * @param {object} req  The request object.
 * @param {object} res  The response object.
 */
export function deleteUser(req, res) {
  const { name = null, email = null, password = null } = req?.body;
  res.json({ message: 'Deleted User.' });
}
