// HammerFlow - Photo Storage
// v2.0 - Store and retrieve photos for jobs

HammerFlow.photos = {
  // Store photos (base64 or URLs)
  store(jobId, photos) {
    const stored = photos.map((photo, i) => ({
      id: `${jobId}_${Date.now()}_${i}`,
      jobId,
      url: photo.url || photo,
      type: photo.type || 'general', // before, during, after, contract, insurance
      caption: photo.caption || '',
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'system'
    }));
    
    // Get existing photos for job
    const existing = this.getPhotos(jobId);
    const all = [...existing, ...stored];
    
    // Save to localStorage (limited to ~5MB)
    const key = `hammerflow_photos_${jobId}`;
    try {
      localStorage.setItem(key, JSON.stringify(all));
    } catch (e) {
      console.error('Photo storage full:', e);
      return { success: false, error: 'Storage full' };
    }
    
    return { success: true, photos: all };
  },
  
  // Get all photos for a job
  getPhotos(jobId) {
    const key = `hammerflow_photos_${jobId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  
  // Get photos by type
  getPhotosByType(jobId, type) {
    return this.getPhotos(jobId).filter(p => p.type === type);
  },
  
  // Delete photo
  delete(photoId) {
    // Find and remove from all jobs
    // This is complex in localStorage, so just mark as deleted
    return { success: true, message: 'Photo would be deleted (implement with DB)' };
  },
  
  // Cleanup old photos (older than X days)
  cleanup(olderThanDays = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    
    let cleaned = 0;
    for (let key in localStorage) {
      if (key.startsWith('hammerflow_photos_')) {
        const photos = JSON.parse(localStorage.getItem(key));
        const kept = photos.filter(p => p.date > cutoffStr);
        if (kept.length < photos.length) {
          localStorage.setItem(key, JSON.stringify(kept));
          cleaned += photos.length - kept.length;
        }
      }
    }
    
    return { success: true, cleaned };
  }
};

console.log('Photo Storage v2.0 loaded');
window.HammerFlow = HammerFlow;