// Fetch User Details Hook
import { useState, useEffect } from 'react';

const useUserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try{
                const response = await fetch('http://localhost:8000/api/user/details', {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserDetails(data);
                } else {
                    console.error('Failed to fetch user details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user details');
            }
        };

        fetchUserDetails();
    }, []);

    return userDetails;
};
export default useUserDetails
