// Portfolio data types
export interface Social {
  id: string;
  title: string;
  link: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  featured?: boolean;
}

export interface Resume {
  tagline: string;
  description: string;
  languages: string[];
  frameworks: string[];
  others: string[];
  experiences: Array<{
    id: string;
    dates: string;
    type: string;
    position: string;
    bullets: string;
  }>;
}

export interface PortfolioData {
  id?: string;
  title?: string;
  summary?: string;
  images?: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  featured?: boolean;
  name: string;
  headerTaglineOne: string;
  headerTaglineTwo: string;
  headerTaglineThree: string;
  headerTaglineFour?: string;
  showCursor: boolean;
  showBlog: boolean;
  darkMode: boolean;
  showResume: boolean;
  socials: Social[];
  projects?: Project[];
  services: Service[];
  aboutpara: string;
  resume: Resume;
  collaborations?: any[];
}

