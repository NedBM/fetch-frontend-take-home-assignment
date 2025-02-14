interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  }
  
  const calculateDistance = (
    zip1: string, 
    zip2: string, 
    locations: Location[]
  ): number => {
    // Validate inputs
    if (!zip1 || !zip2 || !locations?.length) {
      return Infinity;
    }
  
    // Find location objects, using optional chaining for safety
    const loc1 = locations.find(l => l?.zip_code === zip1);
    const loc2 = locations.find(l => l?.zip_code === zip2);
  
    // Early return if either location is not found
    if (!loc1?.latitude || !loc1?.longitude || !loc2?.latitude || !loc2?.longitude) {
      return Infinity;
    }
  
    // Earth's radius in miles
    const R = 3958.8;
  
    // Convert latitude and longitude to radians
    const lat1 = (loc1.latitude * Math.PI) / 180;
    const lat2 = (loc2.latitude * Math.PI) / 180;
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
  
    // Haversine formula
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Return distance in miles
    return R * c;
  };
  
  // Helper function to check if a location is nearby (within specified radius)
  const checkIfNearby = (
    dogZip: string, 
    selectedZipCodes: string[], 
    locations: Location[],
    radiusMiles: number = 50
  ): boolean => {
    if (!dogZip || !selectedZipCodes?.length || !locations?.length) {
      return false;
    }
  
    return selectedZipCodes.some(zip => 
      calculateDistance(zip, dogZip, locations) <= radiusMiles
    );
  };
  
  export { calculateDistance, checkIfNearby };