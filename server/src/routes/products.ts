import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/products — public, with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { size, color, stock } = req.query;
    let products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

    // Parse JSON arrays and apply filters
    let result = products.map(p => ({
      ...p,
      sizes: JSON.parse(p.sizes) as string[],
      colors: JSON.parse(p.colors) as string[],
    }));

    if (size) {
      const sizes = (size as string).split(',');
      result = result.filter(p => p.sizes.some((s: string) => sizes.includes(s)));
    }
    if (color) {
      const colors = (color as string).split(',');
      result = result.filter(p => p.colors.some((c: string) => colors.includes(c)));
    }
    if (stock === 'inStock') {
      result = result.filter(p => p.inStock);
    } else if (stock === 'outOfStock') {
      result = result.filter(p => !p.inStock);
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id — public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products — admin only
router.post('/', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, price, image, sizes, colors, inStock } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        price,
        image,
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(colors),
        inStock: inStock ?? true,
      },
    });
    res.status(201).json({ ...product, sizes, colors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, price, image, sizes, colors, inStock } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = price;
    if (image !== undefined) data.image = image;
    if (sizes !== undefined) data.sizes = JSON.stringify(sizes);
    if (colors !== undefined) data.colors = JSON.stringify(colors);
    if (inStock !== undefined) data.inStock = inStock;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
