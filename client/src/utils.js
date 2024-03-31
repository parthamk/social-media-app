const Base_URL =
  process.env.NODE_ENV !== 'development'
    ? ''
    : 'http://localhost:9000';

export default Base_URL;
