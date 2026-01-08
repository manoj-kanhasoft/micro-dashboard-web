import apiClient from './apiClient';

export type Lead = {
  id?: number;
  name: string;
  company: string;
  email: string;
  lead_status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

interface StrapiLead {
  id: number;
  attributes: {
    name: string;
    company: string;
    email: string;
    lead_status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
  };
}

const transformLead = (strapiLead: StrapiLead | any): Lead => {
  if (!strapiLead.attributes && strapiLead.name) {
    return {
      id: strapiLead.id,
      name: strapiLead.name,
      company: strapiLead.company,
      email: strapiLead.email,
      lead_status: strapiLead.lead_status,
      createdAt: strapiLead.createdAt,
      updatedAt: strapiLead.updatedAt,
      publishedAt: strapiLead.publishedAt || undefined,
    };
  }
  
  if (strapiLead.attributes) {
    return {
      id: strapiLead.id,
      name: strapiLead.attributes.name,
      company: strapiLead.attributes.company,
      email: strapiLead.attributes.email,
      lead_status: strapiLead.attributes.lead_status,
      createdAt: strapiLead.attributes.createdAt,
      updatedAt: strapiLead.attributes.updatedAt,
      publishedAt: strapiLead.attributes.publishedAt || undefined,
    };
  }
  
  console.error('Unexpected lead format:', strapiLead);
  throw new Error('Invalid lead data structure');
};

const transformToStrapi = (lead: Lead) => ({
  data: {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    lead_status: lead.lead_status,
  },
});

export const leadsApi = {
  async getAll(statusFilter?: 'active' | 'inactive'): Promise<Lead[]> {
    try {
      const filters: any = {};
      if (statusFilter) {
        filters.lead_status = {
          $eq: statusFilter,
        };
      }

      const params: any = {};
      if (Object.keys(filters).length > 0) {
        params.filters = JSON.stringify(filters);
      }

      const response = await apiClient.get<StrapiResponse<StrapiLead>>('/leads', {
        params,
      });

      let leads: any[] = [];
      
      if (response.data) {
        leads = Array.isArray(response.data) 
          ? response.data 
          : [response.data];
      } else if (Array.isArray(response)) {
        leads = response;
      } else {
        leads = response ? [response] : [];
      }
      
      return leads
        .filter(lead => lead !== null && lead !== undefined)
        .map(transformLead);
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Lead> {
    try {
      const response = await apiClient.get<StrapiSingleResponse<StrapiLead>>(`/leads/${id}`, {
        params: {
          populate: '*',
        },
      });

      return transformLead(response.data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  },

  async create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<Lead> {
    try {
      const response = await apiClient.post<StrapiSingleResponse<StrapiLead>>(
        '/leads',
        transformToStrapi(lead as Lead)
      );

      return transformLead(response.data);
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  async update(
    id: number,
    lead: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>>
  ): Promise<Lead> {
    try {
      const response = await apiClient.put<StrapiSingleResponse<StrapiLead>>(
        `/leads/${id}`,
        transformToStrapi(lead as Lead)
      );

      return transformLead(response.data);
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/leads/${id}`);
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },
};

export default leadsApi;

