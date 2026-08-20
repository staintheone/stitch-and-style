import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/orders — authenticated users
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { items, firstName, lastName, email, address, city, zip } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
      total += product.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user!.userId,
        total,
        firstName,
        lastName,
        email,
        address,
        city,
        zip,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders — user's own orders
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
