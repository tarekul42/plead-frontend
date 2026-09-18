# PropLead Backend — New Endpoints Implementation Plan

This document details every backend endpoint that needs to be built to support the frontend UI/UX overhaul.

---

## Routing Setup

**File:** `src/app.ts`

Add to the existing route registrations:

```ts
import { blogsPublicRouter } from "./modules/blogs/blogs.public.routes";
import { contactRouter } from "./modules/contact/contact.routes";
import { newsletterRouter } from "./modules/newsletter/newsletter.routes";
import { publicRouter } from "./modules/public/public.routes";
import { favoritesRouter } from "./modules/favorites/favorites.routes";

// Public routes (no auth)
app.use("/api/v1/public", publicRouter); // stats, testimonials, faq
app.use("/api/v1/public/blog", blogsPublicRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/newsletter", newsletterRouter);

// Auth-required routes
app.use("/api/v1/favorites", favoritesRouter);
```

---

## 1. Public Blog Module

**Directory:** `src/modules/blogs/`

### `blogs.public.routes.ts`

```ts
import { Router } from "express";
import { BlogsPublicController } from "./blogs.public.controller";
import { validate } from "../../core/middleware/validate.middleware";
import { blogSlugParamSchema, listBlogsQuerySchema } from "./blogs.validation";

const blogsPublicRouter = Router();

blogsPublicRouter.get("/", validate(listBlogsQuerySchema, "query"), BlogsPublicController.list);

blogsPublicRouter.get(
  "/:slug",
  validate(blogSlugParamSchema, "params"),
  BlogsPublicController.getBySlug,
);

export { blogsPublicRouter };
```

### `blogs.public.controller.ts`

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import { success } from "../../core/utils/api-response";
import { NotFoundError } from "../../core/utils/app-error";
import { Pagination } from "../../core/utils/pagination";
import { BlogModel } from "./blogs.model";

export const BlogsPublicController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = Pagination.from(req.query, 10);
    const filter = { status: "published" };

    const [data, total] = await Promise.all([
      BlogModel.find(filter)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("authorId", "name avatarUrl")
        .lean(),
      BlogModel.countDocuments(filter),
    ]);

    res.json(success(data, Pagination.meta(page, limit, total)));
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const blog = await BlogModel.findOne({
      slug: req.params.slug,
      status: "published",
    })
      .populate("authorId", "name avatarUrl")
      .lean();

    if (!blog) throw NotFoundError("Blog");
    res.json(success(blog));
  }),
};
```

**Key:** No `agencyId` filtering. No auth. Only returns `status: "published"` blogs.

---

## 2. Contact Form Module

**Directory:** `src/modules/contact/`

### `contact.model.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  propertyId?: mongoose.Types.ObjectId;
  status: "new" | "read" | "replied";
  createdAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true },
);

contactSchema.index({ status: 1, createdAt: -1 });

export const ContactModel = mongoose.model<IContact>("Contact", contactSchema);
```

### `contact.validation.ts`

```ts
import { z } from "zod";
import { objectId } from "../../core/utils/validation";

export const createContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  propertyId: objectId.optional(),
});
```

### `contact.service.ts`

```ts
import { ContactModel } from "./contact.model";

export const ContactService = {
  async create(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    propertyId?: string;
  }) {
    return ContactModel.create(data);
  },

  async list(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      ContactModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactModel.countDocuments(),
    ]);
    return { data, total };
  },
};
```

### `contact.controller.ts`

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import { success } from "../../core/utils/api-response";
import { ContactService } from "./contact.service";

export const ContactController = {
  submit: asyncHandler(async (req: Request, res: Response) => {
    const contact = await ContactService.create(req.body);
    res.status(201).json(success(contact));
  }),
};
```

### `contact.routes.ts`

```ts
import { Router } from "express";
import { ContactController } from "./contact.controller";
import { validate } from "../../core/middleware/validate.middleware";
import { createContactSchema } from "./contact.validation";
import { globalRateLimit } from "../../core/middleware/rate-limit.middleware";

const contactRouter = Router();

contactRouter.post("/", globalRateLimit, validate(createContactSchema), ContactController.submit);

export { contactRouter };
```

**Rate limit:** 5 submissions per IP per hour to prevent spam.

---

## 3. Newsletter Module

**Directory:** `src/modules/newsletter/`

### `newsletter.model.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true },
);

export const NewsletterModel = mongoose.model<INewsletter>("Newsletter", newsletterSchema);
```

### `newsletter.validation.ts`

```ts
import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
  email: z.string().email(),
});
```

### `newsletter.service.ts`

```ts
import { NewsletterModel } from "./newsletter.model";
import { ConflictError } from "../../core/utils/app-error";

export const NewsletterService = {
  async subscribe(email: string) {
    const existing = await NewsletterModel.findOne({ email });
    if (existing) {
      if (existing.status === "active") {
        throw ConflictError("Email is already subscribed");
      }
      // Re-subscribe if previously unsubscribed
      existing.status = "active";
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      return existing.save();
    }
    return NewsletterModel.create({ email });
  },
};
```

### `newsletter.controller.ts`

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import { success } from "../../core/utils/api-response";
import { NewsletterService } from "./newsletter.service";

export const NewsletterController = {
  subscribe: asyncHandler(async (req: Request, res: Response) => {
    const result = await NewsletterService.subscribe(req.body.email);
    res.status(201).json(success(result));
  }),
};
```

### `newsletter.routes.ts`

```ts
import { Router } from "express";
import { NewsletterController } from "./newsletter.controller";
import { validate } from "../../core/middleware/validate.middleware";
import { subscribeNewsletterSchema } from "./newsletter.validation";
import { globalRateLimit } from "../../core/middleware/rate-limit.middleware";

const newsletterRouter = Router();

newsletterRouter.post(
  "/subscribe",
  globalRateLimit,
  validate(subscribeNewsletterSchema),
  NewsletterController.subscribe,
);

export { newsletterRouter };
```

---

## 4. Public Stats Endpoint

**New file:** `src/modules/public/public.routes.ts`

```ts
import { Router } from "express";
import { PublicController } from "./public.controller";

const publicRouter = Router();

publicRouter.get("/stats", PublicController.stats);
publicRouter.get("/testimonials", PublicController.testimonials);
publicRouter.get("/faq", PublicController.faq);

export { publicRouter };
```

### `public.controller.ts`

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import { success } from "../../core/utils/api-response";
import { PropertyModel } from "../properties/properties.model";
import { LeadModel } from "../leads/leads.model";
import { AiGeneratedCopyModel } from "../ai/models/ai-copy.model";
import { TestimonialModel } from "../testimonials/testimonials.model";
import { FAQModel } from "../faq/faq.model";

export const PublicController = {
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const [propertiesListed, leadsTracked, aiMatchesMade] = await Promise.all([
      PropertyModel.countDocuments(),
      LeadModel.countDocuments(),
      AiGeneratedCopyModel.countDocuments({ type: "match" }),
    ]);

    res.json(
      success({
        propertiesListed,
        leadsTracked,
        aiMatchesMade,
        avgCloseTimeReduction: 52, // TODO: compute from real data
      }),
    );
  }),

  testimonials: asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await TestimonialModel.find({ featured: true })
      .sort({ sortOrder: 1 })
      .lean();
    res.json(success(testimonials));
  }),

  faq: asyncHandler(async (_req: Request, res: Response) => {
    const faq = await FAQModel.find().sort({ sortOrder: 1 }).lean();
    res.json(success(faq));
  }),
};
```

---

## 5. Property Category Counts

**Add to properties module.**

### New route in `properties.routes.ts` (before auth-required routes):

```ts
propertiesRouter.get("/category-counts", PropertiesController.categoryCounts);
```

### New controller method:

```ts
categoryCounts: asyncHandler(async (_req: Request, res: Response) => {
  const counts = await PropertyModel.aggregate([
    { $group: { _id: "$propertyType", count: { $sum: 1 } } },
  ]);

  const result: Record<string, number> = {};
  counts.forEach((c) => { result[c._id] = c.count; });
  res.json(success(result));
}),
```

**Note:** This must be placed BEFORE any `/:slug` or `/:id` routes to avoid route conflicts.

---

## 6. Favorites Module

**Directory:** `src/modules/favorites/`

### `favorites.model.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "Agency", required: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, createdAt: -1 });

export const FavoriteModel = mongoose.model<IFavorite>("Favorite", favoriteSchema);
```

### `favorites.validation.ts`

```ts
import { z } from "zod";
import { objectId } from "../../core/utils/validation";

export const addFavoriteSchema = z.object({
  propertyId: objectId,
});

export const favoriteParamSchema = z.object({
  propertyId: objectId,
});
```

### `favorites.service.ts`

```ts
import { FavoriteModel } from "./favorites.model";

export const FavoritesService = {
  async list(userId: string, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      FavoriteModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("propertyId")
        .lean(),
      FavoriteModel.countDocuments({ userId }),
    ]);
    return { data, total };
  },

  async add(userId: string, propertyId: string, agencyId: string) {
    return FavoriteModel.findOneAndUpdate(
      { userId, propertyId },
      { userId, propertyId, agencyId },
      { upsert: true, new: true },
    );
  },

  async remove(userId: string, propertyId: string) {
    return FavoriteModel.findOneAndDelete({ userId, propertyId });
  },

  async check(userId: string, propertyId: string) {
    const exists = await FavoriteModel.findOne({ userId, propertyId }).lean();
    return { isFavorited: !!exists };
  },
};
```

### `favorites.controller.ts`

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import { success } from "../../core/utils/api-response";
import { Pagination } from "../../core/utils/pagination";
import { FavoritesService } from "./favorites.service";

export const FavoritesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = Pagination.from(req.query, 20);
    const result = await FavoritesService.list(req.user!.id, page, limit);
    res.json(success(result.data, Pagination.meta(page, limit, result.total)));
  }),

  add: asyncHandler(async (req: Request, res: Response) => {
    const favorite = await FavoritesService.add(
      req.user!.id,
      req.body.propertyId,
      req.user!.agencyId,
    );
    res.status(201).json(success(favorite));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await FavoritesService.remove(req.user!.id, req.params.propertyId);
    res.json(success({ deleted: true }));
  }),

  check: asyncHandler(async (req: Request, res: Response) => {
    const result = await FavoritesService.check(req.user!.id, req.params.propertyId);
    res.json(success(result));
  }),
};
```

### `favorites.routes.ts`

```ts
import { Router } from "express";
import { FavoritesController } from "./favorites.controller";
import { requireAuth } from "../../core/middleware/auth.middleware";
import { validate } from "../../core/middleware/validate.middleware";
import { addFavoriteSchema, favoriteParamSchema } from "./favorites.validation";

const favoritesRouter = Router();

favoritesRouter.use(requireAuth);

favoritesRouter.get("/", FavoritesController.list);
favoritesRouter.post("/", validate(addFavoriteSchema), FavoritesController.add);
favoritesRouter.delete(
  "/:propertyId",
  validate(favoriteParamSchema, "params"),
  FavoritesController.remove,
);
favoritesRouter.get(
  "/check/:propertyId",
  validate(favoriteParamSchema, "params"),
  FavoritesController.check,
);

export { favoritesRouter };
```

---

## 7. Testimonials Module

**Directory:** `src/modules/testimonials/`

### `testimonials.model.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    quote: { type: String, required: true, maxlength: 1000 },
    avatarUrl: { type: String },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

testimonialSchema.index({ featured: 1, sortOrder: 1 });

export const TestimonialModel = mongoose.model<ITestimonial>("Testimonial", testimonialSchema);
```

**Seed data:** Create a seed script to populate initial testimonials.

---

## 8. FAQ Module

**Directory:** `src/modules/faq/`

### `faq.model.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, maxlength: 2000 },
    category: { type: String, required: true, default: "general" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

faqSchema.index({ sortOrder: 1 });

export const FAQModel = mongoose.model<IFAQ>("FAQ", faqSchema);
```

**Seed data:** Create a seed script to populate the 8 existing FAQ items.

---

## Files to Create/Modify Summary

### New Files (Backend)

1. `src/modules/blogs/blogs.public.routes.ts`
2. `src/modules/blogs/blogs.public.controller.ts`
3. `src/modules/contact/contact.model.ts`
4. `src/modules/contact/contact.service.ts`
5. `src/modules/contact/contact.controller.ts`
6. `src/modules/contact/contact.routes.ts`
7. `src/modules/contact/contact.validation.ts`
8. `src/modules/newsletter/newsletter.model.ts`
9. `src/modules/newsletter/newsletter.service.ts`
10. `src/modules/newsletter/newsletter.controller.ts`
11. `src/modules/newsletter/newsletter.routes.ts`
12. `src/modules/newsletter/newsletter.validation.ts`
13. `src/modules/public/public.routes.ts`
14. `src/modules/public/public.controller.ts`
15. `src/modules/favorites/favorites.model.ts`
16. `src/modules/favorites/favorites.service.ts`
17. `src/modules/favorites/favorites.controller.ts`
18. `src/modules/favorites/favorites.routes.ts`
19. `src/modules/favorites/favorites.validation.ts`
20. `src/modules/testimonials/testimonials.model.ts`
21. `src/modules/faq/faq.model.ts`
22. `src/scripts/seed-public-data.ts` (seed testimonials + FAQ)

### Modified Files (Backend)

1. `src/app.ts` — register new routers
2. `src/modules/properties/properties.routes.ts` — add `category-counts` route
3. `src/modules/properties/properties.controller.ts` — add `categoryCounts` method
