// Mock unicorn companies data based on CB Insights data
export interface UnicornCompany {
  id: number;
  company: string;
  valuation: number;
  date_joined: string;
  country: string;
  city: string;
  industry: string;
  select_investors: string;
  founded_year?: number;
}

// Mock dataset of unicorn companies
export const unicornCompanies: UnicornCompany[] = [
  {
    id: 1,
    company: "ByteDance",
    valuation: 140000,
    date_joined: "2017-04-01",
    country: "China",
    city: "Beijing",
    industry: "Social Media",
    select_investors: "SoftBank, General Atlantic, Sequoia Capital",
    founded_year: 2012
  },
  {
    id: 2,
    company: "SpaceX",
    valuation: 137000,
    date_joined: "2012-12-01",
    country: "United States",
    city: "Hawthorne",
    industry: "Aerospace",
    select_investors: "Founders Fund, Draper Fisher Jurvetson, Rothenberg Ventures",
    founded_year: 2002
  },
  {
    id: 3,
    company: "Stripe",
    valuation: 95000,
    date_joined: "2014-01-01",
    country: "United States",
    city: "San Francisco",
    industry: "Fintech",
    select_investors: "Sequoia Capital, General Catalyst, Tiger Global",
    founded_year: 2010
  },
  {
    id: 4,
    company: "Klarna",
    valuation: 45600,
    date_joined: "2011-12-01",
    country: "Sweden",
    city: "Stockholm",
    industry: "Fintech",
    select_investors: "Sequoia Capital, Atomico, Commonwealth Bank",
    founded_year: 2005
  },
  {
    id: 5,
    company: "Canva",
    valuation: 40000,
    date_joined: "2018-01-01",
    country: "Australia",
    city: "Sydney",
    industry: "Software",
    select_investors: "Blackbird Ventures, Felicis Ventures, General Catalyst",
    founded_year: 2013
  },
  {
    id: 6,
    company: "Databricks",
    valuation: 38000,
    date_joined: "2019-02-01",
    country: "United States",
    city: "San Francisco",
    industry: "Data Analytics",
    select_investors: "Andreessen Horowitz, New Enterprise Associates, Battery Ventures",
    founded_year: 2013
  },
  {
    id: 7,
    company: "Epic Games",
    valuation: 31500,
    date_joined: "2012-07-01",
    country: "United States",
    city: "Cary",
    industry: "Gaming",
    select_investors: "Tencent, Sony, Kirkbi",
    founded_year: 1991
  },
  {
    id: 8,
    company: "Instacart",
    valuation: 24000,
    date_joined: "2014-12-01",
    country: "United States",
    city: "San Francisco",
    industry: "E-commerce",
    select_investors: "Sequoia Capital, Andreessen Horowitz, D1 Capital Partners",
    founded_year: 2012
  },
  {
    id: 9,
    company: "Revolut",
    valuation: 33000,
    date_joined: "2018-04-01",
    country: "United Kingdom",
    city: "London",
    industry: "Fintech",
    select_investors: "Index Ventures, Ribbit Capital, TCV",
    founded_year: 2015
  },
  {
    id: 10,
    company: "Nubank",
    valuation: 30000,
    date_joined: "2018-03-01",
    country: "Brazil",
    city: "São Paulo",
    industry: "Fintech",
    select_investors: "Sequoia Capital, Tiger Global, DST Global",
    founded_year: 2013
  },
  {
    id: 11,
    company: "Chime",
    valuation: 25000,
    date_joined: "2019-03-01",
    country: "United States",
    city: "San Francisco",
    industry: "Fintech",
    select_investors: "DST Global, General Atlantic, Coatue Management",
    founded_year: 2013
  },
  {
    id: 12,
    company: "Checkout.com",
    valuation: 40000,
    date_joined: "2019-05-01",
    country: "United Kingdom",
    city: "London",
    industry: "Fintech",
    select_investors: "Insight Partners, Tiger Global, DST Global",
    founded_year: 2012
  },
  {
    id: 13,
    company: "Figma",
    valuation: 20000,
    date_joined: "2019-04-01",
    country: "United States",
    city: "San Francisco",
    industry: "Software",
    select_investors: "Greylock Partners, Kleiner Perkins, Index Ventures",
    founded_year: 2012
  },
  {
    id: 14,
    company: "Discord",
    valuation: 15000,
    date_joined: "2021-09-01",
    country: "United States",
    city: "San Francisco",
    industry: "Social Media",
    select_investors: "Greylock Partners, Spark Capital, Index Ventures",
    founded_year: 2012
  },
  {
    id: 15,
    company: "Notion",
    valuation: 10000,
    date_joined: "2019-04-01",
    country: "United States",
    city: "San Francisco",
    industry: "Software",
    select_investors: "Index Ventures, First Round Capital, Coatue Management",
    founded_year: 2016
  },
  {
    id: 16,
    company: "Plaid",
    valuation: 13400,
    date_joined: "2018-12-01",
    country: "United States",
    city: "San Francisco",
    industry: "Fintech",
    select_investors: "NEA, Spark Capital, Goldman Sachs",
    founded_year: 2013
  },
  {
    id: 17,
    company: "Robinhood",
    valuation: 11700,
    date_joined: "2017-04-01",
    country: "United States",
    city: "Menlo Park",
    industry: "Fintech",
    select_investors: "NEA, Ribbit Capital, 9Point Partners",
    founded_year: 2013
  },
  {
    id: 18,
    company: "Coinbase",
    valuation: 8000,
    date_joined: "2017-08-01",
    country: "United States",
    city: "San Francisco",
    industry: "Fintech",
    select_investors: "Andreessen Horowitz, Union Square Ventures, Ribbit Capital",
    founded_year: 2012
  },
  {
    id: 19,
    company: "Airbnb",
    valuation: 31000,
    date_joined: "2011-07-01",
    country: "United States",
    city: "San Francisco",
    industry: "Travel",
    select_investors: "Greylock Partners, Sequoia Capital, Andreessen Horowitz",
    founded_year: 2008
  },
  {
    id: 20,
    company: "Uber",
    valuation: 72000,
    date_joined: "2013-08-01",
    country: "United States",
    city: "San Francisco",
    industry: "Transportation",
    select_investors: "Benchmark, First Round Capital, Lowercase Capital",
    founded_year: 2009
  }
];

// Data query and filtering functions
export interface QueryFilters {
  country?: string;
  city?: string;
  industry?: string;
  minValuation?: number;
  maxValuation?: number;
  yearRange?: [number, number];
}

export interface QueryResult {
  [key: string]: any;
}

export class MockDataService {
  private data: UnicornCompany[] = unicornCompanies;

  // Get all companies with optional filters
  getCompanies(filters?: QueryFilters): UnicornCompany[] {
    let filtered = [...this.data];

    if (filters?.country) {
      filtered = filtered.filter(c => 
        c.country.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }

    if (filters?.city) {
      filtered = filtered.filter(c => 
        c.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters?.industry) {
      filtered = filtered.filter(c => 
        c.industry.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }

    if (filters?.minValuation) {
      filtered = filtered.filter(c => c.valuation >= filters.minValuation!);
    }

    if (filters?.maxValuation) {
      filtered = filtered.filter(c => c.valuation <= filters.maxValuation!);
    }

    if (filters?.yearRange) {
      filtered = filtered.filter(c => {
        const year = new Date(c.date_joined).getFullYear();
        return year >= filters.yearRange![0] && year <= filters.yearRange![1];
      });
    }

    return filtered;
  }

  // Execute predefined queries based on intent
  executeQuery(intentType: string, params?: any): QueryResult[] {
    switch (intentType) {
      case 'unicorn_count_by_country':
        return this.getUnicornCountByCountry();
      
      case 'unicorn_density':
        return this.getUnicornDensity();
      
      case 'valuation_by_industry':
        return this.getValuationByIndustry();
      
      case 'unicorns_by_year':
        return this.getUnicornsByYear();
      
      case 'top_cities':
        return this.getTopCities();
      
      case 'fintech_vs_other':
        return this.getFintechComparison();
      
      case 'sf_vs_ny':
        return this.getSFvsNY();
      
      case 'us_vs_china':
        return this.getUSvsChina();
      
      default:
        return this.getTopCompaniesByValuation();
    }
  }

  private getUnicornCountByCountry(): QueryResult[] {
    const countByCountry = this.data.reduce((acc, company) => {
      acc[company.country] = (acc[company.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countByCountry)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getUnicornDensity(): QueryResult[] {
    // Mock population data for density calculation
    const populationData: Record<string, number> = {
      'United States': 331900000,
      'China': 1439323776,
      'United Kingdom': 67886011,
      'Sweden': 10353442,
      'Australia': 25499884,
      'Brazil': 212559417
    };

    const countByCountry = this.getUnicornCountByCountry();
    
    return countByCountry
      .filter(item => populationData[item.country])
      .map(item => ({
        country: item.country,
        count: item.count,
        population: populationData[item.country],
        density: (item.count / populationData[item.country] * 1000000).toFixed(2)
      }))
      .sort((a, b) => parseFloat(b.density) - parseFloat(a.density));
  }

  private getValuationByIndustry(): QueryResult[] {
    const valuationByIndustry = this.data.reduce((acc, company) => {
      if (!acc[company.industry]) {
        acc[company.industry] = { total: 0, count: 0 };
      }
      acc[company.industry].total += company.valuation;
      acc[company.industry].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(valuationByIndustry)
      .map(([industry, data]) => ({
        industry,
        total_valuation: data.total,
        average_valuation: Math.round(data.total / data.count),
        count: data.count
      }))
      .sort((a, b) => b.total_valuation - a.total_valuation);
  }

  private getUnicornsByYear(): QueryResult[] {
    const unicornsByYear = this.data.reduce((acc, company) => {
      const year = new Date(company.date_joined).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(unicornsByYear)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }

  private getTopCities(): QueryResult[] {
    const countByCity = this.data.reduce((acc, company) => {
      const cityCountry = `${company.city}, ${company.country}`;
      acc[cityCountry] = (acc[cityCountry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countByCity)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getFintechComparison(): QueryResult[] {
    const fintechCompanies = this.data.filter(c => c.industry === 'Fintech');
    const otherCompanies = this.data.filter(c => c.industry !== 'Fintech');

    return [
      {
        category: 'Fintech',
        count: fintechCompanies.length,
        total_valuation: fintechCompanies.reduce((sum, c) => sum + c.valuation, 0),
        average_valuation: Math.round(fintechCompanies.reduce((sum, c) => sum + c.valuation, 0) / fintechCompanies.length)
      },
      {
        category: 'Other Industries',
        count: otherCompanies.length,
        total_valuation: otherCompanies.reduce((sum, c) => sum + c.valuation, 0),
        average_valuation: Math.round(otherCompanies.reduce((sum, c) => sum + c.valuation, 0) / otherCompanies.length)
      }
    ];
  }

  private getSFvsNY(): QueryResult[] {
    const sfCompanies = this.data.filter(c => c.city === 'San Francisco');
    const nyCompanies = this.data.filter(c => c.city === 'New York');

    return [
      {
        city: 'San Francisco',
        count: sfCompanies.length,
        total_valuation: sfCompanies.reduce((sum, c) => sum + c.valuation, 0)
      },
      {
        city: 'New York',
        count: nyCompanies.length,
        total_valuation: nyCompanies.reduce((sum, c) => sum + c.valuation, 0)
      }
    ];
  }

  private getUSvsChina(): QueryResult[] {
    const usCompanies = this.data.filter(c => c.country === 'United States');
    const chinaCompanies = this.data.filter(c => c.country === 'China');

    return [
      {
        country: 'United States',
        count: usCompanies.length,
        total_valuation: usCompanies.reduce((sum, c) => sum + c.valuation, 0)
      },
      {
        country: 'China',
        count: chinaCompanies.length,
        total_valuation: chinaCompanies.reduce((sum, c) => sum + c.valuation, 0)
      }
    ];
  }

  private getTopCompaniesByValuation(): QueryResult[] {
    return this.data
      .sort((a, b) => b.valuation - a.valuation)
      .slice(0, 10)
      .map(company => ({
        company: company.company,
        valuation: company.valuation,
        country: company.country,
        industry: company.industry
      }));
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
