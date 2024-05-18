export const customFetch = async (url, options = {}) => {
    const baseUrl = 'https://crucial-brightly-monster.ngrok-free.app';
    const headers = {
      'ngrok-skip-browser-warning': '4567',
      ...options.headers,
    };
  
    try {
      const response = await fetch(`${baseUrl}${url}`, { ...options, headers });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      if (options.responseType === 'blob') {
        return response;
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  