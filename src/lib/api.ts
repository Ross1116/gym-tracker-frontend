const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const api = {
  async get(endpoint: string, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    try {
      const response = await fetch(url.toString(), { 
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`GET request to ${endpoint} failed:`, error);
      throw error;
    }
  },


  async post(endpoint: string, data = {}) {

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`POST request to ${endpoint} failed:`, error);
      throw error;
    }
  }
};


export const userApi = {
  getUsers: () => api.get('/users'),

  createUser: (userData: { email: string; password: string; }) => api.post('/users', {
    email: userData.email,
    password: userData.password
  })
};


export const gymApi = {
  getGyms: () => api.get('/gyms'),

  getGym: (id: number) => api.get(`/gyms/${id}`),

  createGym: (gymData: { name: string; userId: number; }) => api.post('/gyms', {
    name: gymData.name,
    user_id: gymData.userId
  })
};


export const equipmentApi = {
  getEquipment: () => api.get('/equipment'),

  getGymEquipment: (gymId: number) => api.get(`/gyms/${gymId}/equipment`),
};

export const equipmentTypeApi = {
  getEquipmentTypes: () => api.get('/equipment-types'),
 
  createEquipmentType: (data: { name: string; }) => api.post('/equipment-types', {
    name: data.name
  })
};

export const exerciseApi = {
  getExercises: () => api.get('/exercises'),
  
  createExercise: (data: { name: string; }) => api.post('/exercises', {
    name: data.name
  })
};

export const workoutApi = {
  getWorkouts: () => api.get('/workouts'),
  
  getWorkout: (id: number) => api.get(`/workouts/${id}`),
  
  createWorkout: (data: { userId: number; gymId: number; exercises: any[]; }) => api.post('/workouts', {
    user_id: data.userId,
    gym_id: data.gymId,
    exercises: data.exercises
  })
};

export default api;