// Define the design stage interface
export interface DesignStage {
  title: string;
  date: string;
  image: string;
  description: string;
  changes?: any[];
  color?: string;
  emoji?: string;
  insights?: string[];
}

/**
 * Generates and downloads a video from design stage images
 * @param stages Array of design stages with image URLs
 * @param options Configuration options for the video
 */
export async function generateAndDownloadVideo(
  stages: DesignStage[],
  options: {
    fps?: number;
    transitionDuration?: number;
    frameDuration?: number;
    filename?: string;
  } = {}
) {
  // Default options
  const {
    fps = 30,
    transitionDuration = 1,
    frameDuration = 3,
    filename = 'design-evolution.webm'
  } = options;
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Unable to get canvas context');
    return;
  }
  
  // Set canvas dimensions (HD)
  canvas.width = 1280;
  canvas.height = 720;
  
  // Load all images first
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };
  
  try {
    // Create a downloadable link for the video
    const createDownloadLink = (url: string, filename: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    // Inform user we're starting
    alert('Starting video generation. This might take a moment...');
    
    // Load all images
    const images = await Promise.all(stages.map(stage => loadImage(stage.image)));
    
    // Calculate video duration and frame count
    const stageDuration = frameDuration + transitionDuration;
    const totalDuration = stageDuration * stages.length;
    const totalFrames = totalDuration * fps;
    
    // Setup MediaRecorder with canvas stream
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      createDownloadLink(url, filename);
      
      // Clean up
      URL.revokeObjectURL(url);
      alert('Video generated successfully! Downloading...');
    };
    
    // Start recording
    recorder.start();
    
    // Animation function to draw frames
    let frameCount = 0;
    
    const drawFrame = () => {
      if (frameCount >= totalFrames) {
        recorder.stop();
        return;
      }
      
      // Clear canvas for the new frame
      ctx.fillStyle = '#1e293b'; // slate-800 background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate current position in animation
      const overallProgress = frameCount / totalFrames;
      const currentStageIndex = Math.min(
        Math.floor(overallProgress * stages.length),
        stages.length - 1
      );
      
      // Calculate transition between current and next stage
      const nextStageIndex = (currentStageIndex + 1) % stages.length;
      
      // How far we are within current stage (0-1)
      const stageProgress = (overallProgress * stages.length) % 1;
      
      // Determine if we're in transition
      const isTransitioning = stageProgress > (frameDuration / stageDuration);
      
      // Draw the current image
      const currentImage = images[currentStageIndex];
      
      // Position and sizing calculations for the image
      const imageAspect = currentImage.width / currentImage.height;
      const canvasAspect = canvas.width / canvas.height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imageAspect > canvasAspect) {
        // Image is wider than canvas (relative to height)
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageAspect;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image is taller than canvas (relative to width)
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageAspect;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }
      
      // Draw the current image
      ctx.globalAlpha = 1;
      ctx.drawImage(currentImage, drawX, drawY, drawWidth, drawHeight);
      
      // If transitioning, blend with the next image
      if (isTransitioning) {
        const nextImage = images[nextStageIndex];
        const transitionProgress = (stageProgress - (frameDuration / stageDuration)) / (transitionDuration / stageDuration);
        
        // Draw the next image with transparency for transition
        ctx.globalAlpha = transitionProgress;
        
        // Calculate position for next image
        let nextDrawWidth, nextDrawHeight, nextDrawX, nextDrawY;
        const nextImageAspect = nextImage.width / nextImage.height;
        
        if (nextImageAspect > canvasAspect) {
          nextDrawHeight = canvas.height;
          nextDrawWidth = nextDrawHeight * nextImageAspect;
          nextDrawX = (canvas.width - nextDrawWidth) / 2;
          nextDrawY = 0;
        } else {
          nextDrawWidth = canvas.width;
          nextDrawHeight = nextDrawWidth / nextImageAspect;
          nextDrawX = 0;
          nextDrawY = (canvas.height - nextDrawHeight) / 2;
        }
        
        ctx.drawImage(nextImage, nextDrawX, nextDrawY, nextDrawWidth, nextDrawHeight);
      }
      
      // Draw stage info
      const currentStage = stages[currentStageIndex];
      
      // Draw date badge
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(37, 99, 235, 0.8)'; // blue-600/80
      ctx.beginPath();
      ctx.roundRect(20, 20, 120, 30, 15);
      ctx.fill();
      
      // Date text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentStage.date, 80, 35);
      
      // Draw title banner at bottom
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // slate-900/85
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
      
      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(currentStage.title, 20, canvas.height - 90);
      
      // Description
      ctx.fillStyle = '#cbd5e1'; // slate-300
      ctx.font = '16px sans-serif';
      ctx.fillText(
        currentStage.description.length > 100 
          ? currentStage.description.substring(0, 100) + '...' 
          : currentStage.description, 
        20, 
        canvas.height - 55
      );
      
      // Progress bar at bottom
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; // slate-800/90
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
      
      // Progress indicator
      ctx.fillStyle = '#3b82f6'; // blue-500
      ctx.fillRect(0, canvas.height - 10, canvas.width * overallProgress, 10);
      
      // Stage indicators (dots)
      const dotSpacing = canvas.width / (stages.length + 1);
      
      for (let i = 0; i < stages.length; i++) {
        const dotX = (i + 1) * dotSpacing;
        const dotY = canvas.height - 5;
        const dotRadius = i === currentStageIndex ? 5 : 3;
        
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = i === currentStageIndex ? '#3b82f6' : '#64748b';
        ctx.fill();
      }
      
      frameCount++;
      requestAnimationFrame(drawFrame);
    };
    
    // Start the animation
    drawFrame();
    
  } catch (error) {
    console.error('Error generating video:', error);
    alert('Failed to generate video. See console for details.');
  }
}