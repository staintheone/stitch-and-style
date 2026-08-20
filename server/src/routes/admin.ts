import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/stats — admin dashboard stats
router.get('/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const inStock = await prisma.product.count({ where: { inStock: true } });
    const outOfStock = await prisma.product.count({ where: { inStock: false } });
    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.user.count();

    res.json({ totalProducts, inStock, outOfStock, totalOrders, totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/orders — all orders (admin)
router.get('/orders', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/orders/:id — update order status
router.patch('/orders/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
