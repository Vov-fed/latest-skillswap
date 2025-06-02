import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
export const signUp = async (values: {
  name: string
  email: string
  password: string
}) => {
    const response = await axios.post('http://localhost:3000/users/signup', {
        name: values.name,
        email: values.email,
        password: values.password,
        });
    return response.data;
}

export const signIn = async (values: {
  email: string
  password: string
}) => {
    const response = await axios.post('http://localhost:3000/users/login', {
        email: values.email,
        password: values.password,
        });
    return response.data;
}

export const getUser = async () => {
  const token = Cookies.get('token');
  if (!token) {
    return false;
  }
  const response = await axios.post(
    'http://localhost:3000/users/profile',
    {},
    {
      headers: {
        authorization: token,
      },
    }
  );
  if (!response.data || !response.data.user) {
    return false;
  }
  return response.data;
};

export const updateUser = async (values: {
  name?: string
  email?: string
  bio?: string
  location?: string
  profilePicture?: string
  headerPicture?: string
  profession?: string
  skills?: (string | { name: string })[]
  currentPassword?: string
  newPassword?: string
}) => {
    const token = Cookies.get('token');
    if (!token) {
      return false;
    }

    const updatedValues = {...values};

    if (values.skills && values.skills.length > 0) {
      const existingUser = await getUser();
      if (existingUser && existingUser.skills && Array.isArray(existingUser.skills)) {
        const mergedSkills = Array.from(new Set([...existingUser.skills, ...values.skills]));
        updatedValues.skills = mergedSkills;
      }
    }

    if (updatedValues.skills && Array.isArray(updatedValues.skills)) {
      updatedValues.skills = updatedValues.skills.map(skill => {
        if (typeof skill === 'string') {
          return { name: skill };
        } else if (skill && typeof skill === 'object' && 'name' in skill) {
          return skill;
        } else {
          return { name: String(skill) };
        }
      });
    }

    const response = await axios.post(
      'http://localhost:3000/users/update',
      updatedValues,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
};

export const deleteUser = async () => {
  const token = Cookies.get('token');
  if (!token) {
    return false;
  }
  const response = await axios.delete(
    'http://localhost:3000/users/delete',
    {
      headers: {
        authorization: token,
      },
    }
  );
  return response.data;
};

export const getUsersByIds = async (ids: string[]) => {
  const token = Cookies.get('token');
  const response = await axios.post(
    'http://localhost:3000/users/getUsersByIds',
    { ids },
    {
      headers: {
        authorization: token,
      },
    }
  );
  return response.data;
};

export const getUserById = async (id: string) => {
  const token = Cookies.get('token');
  if (!token) {
    return false;
  }
  const response = await axios.get(`http://localhost:3000/users/${id}`, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
}

export const getUserIdByToken = () => {
  const token = Cookies.get('token');
  if (!token) {
    return null;
  }
  const decoded = jwtDecode<{ userId: string }>(token);
  return decoded.userId || null;
}