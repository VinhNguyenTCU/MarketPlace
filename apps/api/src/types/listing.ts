export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category_id: string;
  condition_id: string;
  price: number;
  is_free: boolean;
  status: ListingStatus;
  location: string;
  created_at: string;
};

export const ListingSort = {
    recent: "recent",
    price_asc: "price_asc",
    price_desc: "price_desc",
} as const;

export type ListingSort = (typeof ListingSort)[keyof typeof ListingSort];

export type SearchListingsParams = {
  query: string;
  categoryId?: string;
  conditionId?: string;
  status?: ListingStatus;
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  offset?: number;
  limit?: number;
};


export type ListingUpdateInput = Partial<
  Pick<
    Listing,
    | "title"
    | "description"
    | "category_id"
    | "condition_id"
    | "price"
    | "is_free"
    | "status"
    | "location"
  >
>

export const ListingStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
} as const;

export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

export const ListingCondition = {
    BEST: "BEST",
    GOOD: "GOOD",
    NORMAL: "NORMAL",
    BAD: "BAD",
} as const;

export type ListingCondition = (typeof ListingCondition)[keyof typeof ListingCondition];

