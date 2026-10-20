import { Router, Response } from 'express';
import { db } from '../database/mongo';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.complaintCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// POST /api/categories (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and Code are required' });
    }

    const created = await db.complaintCategory.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description || null
      }
    });

    await db.auditLog.create({
      data: {
        entityType: 'MASTER_DATA',
        action: 'CREATE',
        details: `Created new complaint category: ${created.name} (${created.code})`,
        performedBy: req.user?.email || 'admin',
        ipAddress: req.ip
      }
    });

    res.status(201).json({ category: created });
  } catch (error: any) {
    res.status(500).json({ error: 'Error creating category. Ensure code/name is unique.' });
  }
});

export default router;
