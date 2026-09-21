import type { AnalyticsGrain, AnalyticsRange } from "./catalog";

export type NamedCount = {
  key: string;
  label: string;
  count: number;
  share: number;
};

export type LiveSnapshot = {
  liveVisitors: number;
  countries: NamedCount[];
  cities: NamedCount[];
};

export type TrendValue = number | null;

export type TrendPoint = {
  period: string;
  pageviews: TrendValue;
  visitors: TrendValue;
  bookClicks: TrendValue;
  bookClicksUs: TrendValue;
};

export type AnalyticsSummary = {
  configured: boolean;
  environment: string;
  range: AnalyticsRange;
  grain: AnalyticsGrain;
  from: string;
  to: string;
  liveVisitors: number;
  liveCountries: NamedCount[];
  liveCities: NamedCount[];
  totals: {
    pageviews: number;
    visitors: number;
    bookClicks: number;
    bookVisitors: number;
    bookClicksUs: number;
    bookVisitorsUs: number;
  };
  previous: {
    pageviews: number;
    visitors: number;
    bookClicks: number;
    bookClicksUs: number;
  };
  trend: TrendPoint[];
  pages: NamedCount[];
  caseStudies: NamedCount[];
  bookButtons: NamedCount[];
  bookPages: NamedCount[];
  bookCountries: NamedCount[];
  bookCities: NamedCount[];
  bookButtonsUs: NamedCount[];
  bookPagesUs: NamedCount[];
  bookCitiesUs: NamedCount[];
};
