import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCheckoutSession, stripeWebhookHandler } from './stripe.controller';

const { mockStripeInstance, mockPrismaInstance } = vi.hoisted(() => {
  return {
    mockStripeInstance: {
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/test' }),
          retrieve: vi.fn(),
        },
      },
      coupons: {
        create: vi.fn().mockResolvedValue({ id: 'cp_123' }),
      },
      webhooks: {
        constructEvent: vi.fn(),
      },
    },
    mockPrismaInstance: {
      giftCard: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      order: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
      product_quantity: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => {
        return await cb(mockPrismaInstance);
      }),
    }
  };
});

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(function() {
      return mockStripeInstance;
    }),
  };
});

// Mock Prisma
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(function() {
      return mockPrismaInstance;
    }),
  };
});

describe('Stripe Controller', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'test_secret';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    req = {
      body: {},
      query: {},
      headers: {},
    };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  describe('createCheckoutSession', () => {
    it('creates a session successfully', async () => {
      req.body = {
        cart: [{ id: 1, name: 'Product 1', price: 100, quantity: 1 }],
        customerId: 123,
      };

      await createCheckoutSession(req, res);

      expect(res.json).toHaveBeenCalledWith({ url: 'https://checkout.stripe.com/test' });
    });

    it('handles gift cards correctly', async () => {
      req.body = {
        cart: [{ id: 1, name: 'Product 1', price: 100, quantity: 1 }],
        giftCardCode: 'GIFT100',
      };

      mockPrismaInstance.giftCard.findUnique.mockResolvedValue({
        code: 'GIFT100',
        isEnabled: true,
        balance: 5000, // 50 DKK
      });

      await createCheckoutSession(req, res);

      expect(mockPrismaInstance.giftCard.findUnique).toHaveBeenCalledWith({ where: { code: 'GIFT100' } });
      expect(res.json).toHaveBeenCalledWith({ url: 'https://checkout.stripe.com/test' });
    });

    it('returns freeOrder if gift card covers total', async () => {
      req.body = {
        cart: [{ id: 1, name: 'Product 1', price: 10, quantity: 1 }],
        giftCardCode: 'GIFT100',
      };

      mockPrismaInstance.giftCard.findUnique.mockResolvedValue({
        code: 'GIFT100',
        isEnabled: true,
        balance: 2000, // 20 DKK
      });

      await createCheckoutSession(req, res);

      expect(res.json).toHaveBeenCalledWith({ freeOrder: true, giftCardCode: 'GIFT100' });
    });
  });

  describe('stripeWebhookHandler', () => {
    it('rejects invalid signature', async () => {
      req.headers['stripe-signature'] = 'invalid';
      req.body = Buffer.from('{}');

      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await stripeWebhookHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Webhook Error'));
    });

    it('accepts valid signature and handles checkout.session.completed', async () => {
      req.headers['stripe-signature'] = 'valid';
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'sess_123',
            metadata: {
              customerId: '123',
              cart: JSON.stringify([{ id: 1, quantity: 1, price: 100 }]),
            },
            amount_total: 10000,
            currency: 'dkk',
            payment_intent: 'pi_123',
            customer_details: { email: 'test@example.com' },
            shipping_details: { name: 'Test User' },
          },
        },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrismaInstance.order.create.mockResolvedValue({ id: 1 });

      await stripeWebhookHandler(req, res);

      expect(res.json).toHaveBeenCalledWith({ received: true });
      expect(mockPrismaInstance.order.create).toHaveBeenCalled();
    });
  });
});
