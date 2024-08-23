import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getSavedRecipesForUser(req, res);
    case 'POST':
      return saveRecipe(req, res);
    case 'DELETE':
      return unsaveRecipe(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getSavedRecipesForUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const savedRecipes = await prisma.savedRecipe.findMany({
      where: { userId: Number(userId) },
      include: { Recipe: true },
    });

    const recipeData = savedRecipes.map((sr) => {
      return {
        id: sr.recipeId,
        ...sr.Recipe,
      };
    });

    console.log('Fetched saved recipes for user:', recipeData);
    res.status(200).json(recipeData);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ message: 'Failed to fetch saved recipes' });
  }
}

async function saveRecipe(req: NextApiRequest, res: NextApiResponse) {
  const { userId, recipeId, title, image, sourceUrl, readyInMinutes } =
    req.body.recipe || {};

  console.log('Received data:', {
    userId,
    recipeId,
    title,
    image,
    sourceUrl,
    readyInMinutes,
  });

  if (
    !userId ||
    !recipeId ||
    !title ||
    !image ||
    !sourceUrl ||
    !readyInMinutes
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!userExists) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    let recipeExists = await prisma.recipe.findUnique({
      where: { id: Number(recipeId) },
    });
    if (!recipeExists) {
      recipeExists = await prisma.recipe.create({
        data: {
          id: Number(recipeId),
          title: title,
          image: image,
          sourceUrl: sourceUrl,
          readyInMinutes: readyInMinutes,
        },
      });
    }

    const savedRecipe = await prisma.savedRecipe.create({
      data: {
        userId: Number(userId),
        recipeId: Number(recipeId),
      },
    });

    res.status(201).json(savedRecipe);
  } catch (error: any) {
    console.error('Error saving recipe:', error.message || error);
    res
      .status(500)
      .json({ message: 'Failed to save recipe', error: error.message });
  }
}

async function unsaveRecipe(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, recipeId } = req.query;

    if (!userId || !recipeId) {
      return res.status(400).json({ error: 'Missing userId or recipeId' });
    }

    await prisma.savedRecipe.delete({
      where: {
        userId_recipeId: {
          recipeId: Number(recipeId),
          userId: Number(userId),
        },
      },
    });

    res.status(200).json({ message: 'Recipe unsaved successfully' });
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    res.status(500).json({ error: 'Failed to unsave recipe' });
  }
}
