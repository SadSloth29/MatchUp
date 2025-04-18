export const Similarity = (a, b) => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
    return dotProduct / (magnitudeA * magnitudeB);
  };

export const similarityToPercentage = (similarity) => {
    return Math.round(similarity * 100); 
  };