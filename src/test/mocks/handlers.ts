import { http, HttpResponse } from "msw";
import type { Property, Lead, Interaction, Review, User } from "@/types/models";
import type { ApiResponse } from "@/types/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const mockProperties: Property[] = [
  {
    _id: "prop-1",
    title: "Modern Downtown Loft",
    slug: "modern-downtown-loft",
    description: "A beautiful modern loft in the heart of downtown.",
    price: 550000,
    location: "Austin, TX",
    address: "123 Main St, Austin, TX 73301",
    images: ["https://example.com/img1.jpg"],
    beds: 2,
    baths: 2,
    area: 1200,
    propertyType: "condo",
    status: "available",
    features: ["Pool", "Gym"],
    assignedAgentId: "agent-1",
    views: 150,
    inquiriesCount: 5,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    _id: "prop-2",
    title: "Suburban Family Home",
    slug: "suburban-family-home",
    description: "Spacious family home with a large backyard.",
    price: 425000,
    location: "Round Rock, TX",
    images: ["https://example.com/img2.jpg"],
    beds: 4,
    baths: 3,
    area: 2400,
    propertyType: "house",
    status: "available",
    features: ["Garage", "Yard"],
    assignedAgentId: "agent-1",
    views: 89,
    inquiriesCount: 3,
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
  },
];

export const mockLeads: Lead[] = [
  {
    _id: "lead-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0101",
    budget: 500000,
    preferredLocation: "Austin, TX",
    status: "new",
    assignedAgentId: "agent-1",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
];

export const mockInteractions: Interaction[] = [
  {
    _id: "int-1",
    leadId: "lead-1",
    type: "call",
    notes: "Discussed property preferences",
    outcome: "positive",
    performedById: "agent-1",
    createdAt: "2025-03-02T00:00:00Z",
    updatedAt: "2025-03-02T00:00:00Z",
  },
];

export const mockUsers: User[] = [
  {
    _id: "agent-1",
    clerkId: "clerk_agent_1",
    email: "agent@proplead.ai",
    name: "Agent Smith",
    role: "agent",
    agencyId: "agency-1",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

export const mockReviews: Review[] = [
  {
    _id: "rev-1",
    propertyId: "prop-1",
    userId: "user-1",
    rating: 5,
    title: "Amazing property",
    comment: "Exceeded expectations",
    isVerified: true,
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },
];

export const handlers = [
  http.get(`${API}/properties`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 12);
    const filtered = mockProperties.slice(0, limit);
    return HttpResponse.json<ApiResponse<Property[]>>({
      success: true,
      data: filtered,
      meta: { page, limit, total: mockProperties.length },
    });
  }),

  http.get(`${API}/properties/:slug`, ({ params }) => {
    const prop = mockProperties.find((p) => p.slug === params.slug);
    if (!prop) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json<ApiResponse<Property>>({ success: true, data: prop });
  }),

  http.post(`${API}/properties`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json<ApiResponse<Property>>(
      { success: true, data: { ...mockProperties[0], ...(body as object) } },
      { status: 201 },
    );
  }),

  http.patch(`${API}/properties/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json<ApiResponse<Property>>({
      success: true,
      data: { ...mockProperties[0], ...(body as object) },
    });
  }),

  http.delete(`${API}/properties/:id`, () =>
    HttpResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    }),
  ),

  http.get(`${API}/leads`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    return HttpResponse.json<ApiResponse<Lead[]>>({
      success: true,
      data: mockLeads.slice(0, limit),
      meta: { page, limit, total: mockLeads.length },
    });
  }),

  http.get(`${API}/leads/:id`, ({ params }) => {
    const lead = mockLeads.find((l) => l._id === params.id);
    if (!lead) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json<ApiResponse<Lead>>({ success: true, data: lead });
  }),

  http.post(`${API}/leads`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json<ApiResponse<Lead>>(
      { success: true, data: { ...mockLeads[0], ...(body as object) } },
      { status: 201 },
    );
  }),

  http.patch(`${API}/leads/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json<ApiResponse<Lead>>({
      success: true,
      data: { ...mockLeads[0], ...(body as object) },
    });
  }),

  http.delete(`${API}/leads/:id`, () =>
    HttpResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    }),
  ),

  http.get(`${API}/interactions`, () =>
    HttpResponse.json<ApiResponse<Interaction[]>>({
      success: true,
      data: mockInteractions,
    }),
  ),

  http.get(`${API}/leads/:leadId/interactions`, () =>
    HttpResponse.json<ApiResponse<Interaction[]>>({
      success: true,
      data: mockInteractions,
    }),
  ),

  http.post(`${API}/leads/:leadId/interactions`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json<ApiResponse<Interaction>>(
      {
        success: true,
        data: {
          _id: "int-new",
          leadId: "lead-1",
          type: "call",
          notes: "",
          outcome: "neutral",
          performedById: "agent-1",
          createdAt: "2025-06-15T10:00:00Z",
          updatedAt: "2025-06-15T10:00:00Z",
          ...(body as object),
        },
      },
      { status: 201 },
    );
  }),

  http.get(`${API}/users`, () =>
    HttpResponse.json<ApiResponse<User[]>>({
      success: true,
      data: mockUsers,
    }),
  ),

  http.get(`${API}/reviews`, () =>
    HttpResponse.json<ApiResponse<Review[]>>({
      success: true,
      data: mockReviews,
    }),
  ),

  http.get(`${API}/health`, () =>
    HttpResponse.json({ status: "ok", db: "connected", timestamp: Date.now() }),
  ),

  http.post(`${API}/ai/match-lead-properties`, () =>
    HttpResponse.json({
      success: true,
      data: [
        {
          propertyId: "prop-1",
          propertyTitle: "Modern Downtown Loft",
          propertyLocation: "Austin, TX",
          score: 92,
          reasons: ["Matches budget", "Preferred location"],
        },
      ],
    }),
  ),
];
