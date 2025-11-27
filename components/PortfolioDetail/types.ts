export interface PartnerCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface PartnerRank {
  id: string;
  name: string;
}

export interface PortfolioPartner {
  id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  location?: string;
  category?: PartnerCategory;
  rank?: PartnerRank;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  featured?: boolean;
  partner?: PortfolioPartner;
  datePublished?: string;
  createdAt?: string;
}

