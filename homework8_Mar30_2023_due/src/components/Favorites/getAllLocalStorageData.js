
const getAllLocalStorageData = () => {
    const localStorageData = {};
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
  
      try {
        localStorageData[key] = JSON.parse(value);
      } catch (error) {
        localStorageData[key] = value;
      }
    }
  
    return localStorageData;
};

export default getAllLocalStorageData;