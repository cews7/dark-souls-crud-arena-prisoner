export const validateHeroBody = (body) => {
    const allowedFields = ['name', 'level', 'class', 'id'];
    for (const [key, value] of Object.entries(body)) {
        if (!allowedFields.includes(key)) {
            return false;
        }
        if (key === 'id' && typeof value !== 'number') {
            return false;
        }
        if (key === 'level' && typeof value !== 'number') {
            return false;
        }
        if (key === 'name' && typeof value !== 'string') {
            return false;
        }
        if (key === 'class' && typeof value !== 'string') {
            return false;
        }
    }
    return true;
}

export const validateEquipmentBody = (body) => {
    const allowedFields = ['name', 'type', 'minLevel'];
    for (const [key, value] of Object.entries(body)) {
        if (!allowedFields.includes(key)) {
            return false;
        }
        if (key === 'minLevel' && typeof value !== 'number') {
            return false;
        }
        if (key === 'name' && typeof value !== 'string') {
            return false;
        }
        if (key === 'type' && typeof value !== 'string') {
            return false;
        }
    }
    return true;
}

export const parseJsonBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        resolve(parsedBody);
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}