import axios from 'axios';

export async function getToken(email) {
  const response = await axios.get(`http://localhost:5000/token/${email}`);
  const { data } = response;
  return data.token;
}