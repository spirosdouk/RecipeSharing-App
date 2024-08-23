import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);

    const response = await axios({
      method: req.method,
      url: `https://api.spoonacular.com/recipes/complexSearch${req.url}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SPOONACULAR_API_KEY}`,
      },
      data: req.body,
    });

    console.log('Spoonacular Response:', response.data);

    const filteredData = filterData(response.data);
    res.status(response.status).json(filteredData);
  } catch (error: any) {
    console.error('Error fetching data from Spoonacular API:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch data from Spoonacularz API',
      details: error.message,
    });
  }
}

function filterData(data: { sensitiveField: any }) {
  delete data.sensitiveField;
  return data;
}
