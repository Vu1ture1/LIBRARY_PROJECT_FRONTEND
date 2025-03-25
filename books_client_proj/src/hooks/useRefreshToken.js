import axios from '../api/axios';

const useRefreshToken = () => {
    const refresh = async () => {
        try {
            const response = await axios.post('user/login/refresh', {}, {
                withCredentials: true
            });
            
            return response.data.accessToken;
        } catch (error) {
            console.error('Error refreshing token', error);
        }
    }
    
    return refresh;
};

export default useRefreshToken;
