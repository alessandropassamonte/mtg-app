import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Motion } from '@capacitor/motion';
import { faCamera, faCameraRetro, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from '@angular/common/http';

interface CameraSettings {
  focusMode: string;
  exposureMode: string;
  whiteBalanceMode: string;
  zoom: number;
}

interface DetectedCard {
  imageBase64: string;
  confidence: number;
  timestamp: string;
}

@Component({
  selector: 'app-card-scan',
  templateUrl: './new-card-scan.component.html',
  styleUrls: ['./new-card-scan.component.scss']
})
export class NewCardScanComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas', { static: true }) overlayCanvas!: ElementRef<HTMLCanvasElement>;

  model!: tf.GraphModel;
  logs: string[] = [];
  faCamera = faCameraRetro;
  faSpinner = faSpinner;
  isSending = false;
  lastDetectedBoxes: Array<{
    coords: number[];
    confidence: number;
  }> = [];


  
  private detectionInterval: any;
  private stream: MediaStream | null = null;
  private imageProcessor: ImageProcessor;
   isProcessing = false;
  private motionListenerActive = false;
  
  // Enhanced camera settings
  readonly IDEAL_RESOLUTION = {
    width: { ideal: 3840 }, // 4K
    height: { ideal: 2160 }
  };
  
  readonly CAMERA_SETTINGS: CameraSettings = {
    focusMode: 'continuous',
    exposureMode: 'continuous',
    whiteBalanceMode: 'continuous',
    zoom: 1.0
  };

  constructor(
    private platform: Platform, private http: HttpClient
  ) {
    this.imageProcessor = new ImageProcessor();
  }

  async ngOnInit() {
    this.addLog('Initializing card scanner...');
    await this.loadModel();
    await this.startCamera();
    await this.setupMotionDetection();
    this.setupOverlay();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private async cleanup() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.motionListenerActive) {
      await Motion.removeAllListeners();
    }
    if (this.model) {
      this.model.dispose();
    }
  }

  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    console.log(fullMessage);
    this.logs.push(fullMessage);
    
    // Keep only last 50 logs
    if (this.logs.length > 50) {
      this.logs.shift();
    }
  }

  async loadModel() {
    try {
      this.addLog("Loading TensorFlow.js model...");
      this.model = await tf.loadGraphModel('/assets/tensorflow_model/model.json');
      this.addLog('Model loaded successfully');
      this.addLog(`Model inputs: ${JSON.stringify(this.model.inputs)}`);
      this.addLog(`Model outputs: ${JSON.stringify(this.model.outputs)}`);
    } catch (error) {
      this.addLog(`Error loading model: ${error}`);
      throw error;
    }
  }

  async startCamera() {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: this.IDEAL_RESOLUTION.width,
          height: this.IDEAL_RESOLUTION.height,
          aspectRatio: 4/3,
          frameRate: { ideal: 30 }
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;

      // Get actual stream settings
      const track = this.stream.getVideoTracks()[0];
      const settings = track.getSettings();
      
      this.addLog(`Camera initialized with resolution: ${settings.width}x${settings.height}`);
      
      // Try to apply advanced constraints if available
      try {
        // Cast to any to access non-standard capabilities
        const capabilities = track.getCapabilities() as any;
        if (capabilities && capabilities.focusMode && 
            Array.isArray(capabilities.focusMode) && 
            capabilities.focusMode.includes('continuous')) {
          await track.applyConstraints({
            advanced: [{
              // @ts-ignore Cast to any to use non-standard constraints
              focusMode: 'continuous' as any
            }]
          });
        }
      } catch (error) {
        this.addLog('Advanced camera features not supported');
      }

      video.onloadedmetadata = () => {
        video.play().catch(err => this.addLog(`Play error: ${err}`));
        this.startDetectionLoop();
      };

    } catch (error) {
      this.addLog(`Camera access error: ${error}`);
    }
  }

  private async setupMotionDetection() {
    try {
      // Check if motion is available
      if (this.platform.is('capacitor')) {
        try {
          // Try to check motion permission status
          await Motion.addListener('accel', (event) => {
            this.updateOverlayBasedOnMotion(event);
          });
          
          this.motionListenerActive = true;
          this.addLog('Motion detection activated');
        } catch (error) {
          this.addLog('Motion sensors not available or permission denied');
        }
      } else {
        this.addLog('Motion detection not available in this environment');
      }
    } catch (error) {
      this.addLog(`Motion setup error: ${error}`);
    }
  }

  private setupOverlay() {
    const overlay = this.overlayCanvas.nativeElement;
    overlay.width = this.videoElement.nativeElement.width;
    overlay.height = this.videoElement.nativeElement.height;
    this.drawGuideOverlay(overlay);
  }

  private drawGuideOverlay(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw card guide rectangle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Standard Magic card ratio is 2.5" x 3.5" (1:1.4)
    const cardWidth = canvas.width * 0.7;
    const cardHeight = cardWidth * 1.4;
    
    ctx.strokeRect(
      centerX - cardWidth / 2,
      centerY - cardHeight / 2,
      cardWidth,
      cardHeight
    );
  }

  private updateOverlayBasedOnMotion(event: { acceleration: { x: number; y: number; z: number; }; }) {
    const overlay = this.overlayCanvas.nativeElement;
    const ctx = overlay.getContext('2d')!;
    
    // Clear previous overlay
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    
    // Calculate tilt angles from acceleration data
    const tiltX = Math.atan2(event.acceleration.x, event.acceleration.z) * (180 / Math.PI);
    const tiltY = Math.atan2(event.acceleration.y, event.acceleration.z) * (180 / Math.PI);
    
    // Update guide overlay with tilt indication
    this.drawGuideOverlay(overlay);
    
    // Add tilt indicator if device is not level
    if (Math.abs(tiltX) > 5 || Math.abs(tiltY) > 5) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.font = '60px Arial';
      ctx.fillText('Please hold the device level', 10, 30);
    }
  }

  private startDetectionLoop() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }

    this.detectionInterval = setInterval(async () => {
      if (this.isProcessing) return;
      this.isProcessing = true;

      try {
        await this.detectObjects();
      } finally {
        this.isProcessing = false;
      }
    }, 100); // Faster detection interval
  }

  private async detectObjects() {
    if (!this.model) {
      this.addLog("Model not loaded!");
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Match canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prepare and enhance frame
    const enhancedFrame = await this.imageProcessor.enhanceFrame(video);
    
    // Prepare tensor
    const inputTensor = tf.tidy(() => {
      return tf.browser.fromPixels(enhancedFrame)
        .resizeBilinear([640, 640])
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));
    });

    try {
      const prediction = await this.model.executeAsync(inputTensor) as tf.Tensor;
      await this.processDetections(prediction, canvas);
      tf.dispose([inputTensor, prediction]);
    } catch (err) {
      this.addLog(`Detection error: ${err}`);
      tf.dispose(inputTensor);
    }
  }

  // Aggiungiamo un metodo per catturare e inviare le immagini
  async captureAndSendDetections() {
    if (this.isSending || this.lastDetectedBoxes.length === 0) {
      this.addLog('No cards detected or already sending');
      return;
    }

    try {
      this.isSending = true;
      this.addLog('Capturing detected cards...');

      const video = this.videoElement.nativeElement;
      const detectedCards: DetectedCard[] = [];

      // Creiamo un canvas temporaneo per il ritaglio
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;

      // Processiamo ogni box rilevato
      for (const detection of this.lastDetectedBoxes) {
        const [yMin, xMin, yMax, xMax] = detection.coords;
        
        // Calcoliamo le dimensioni reali sul video
        const scaleX = video.videoWidth / 640;
        const scaleY = video.videoHeight / 640;
        
        const realX = xMin * scaleX;
        const realY = yMin * scaleY;
        const realWidth = (xMax - xMin) * scaleX;
        const realHeight = (yMax - yMin) * scaleY;

        // Impostiamo le dimensioni del canvas temporaneo
        tempCanvas.width = realWidth;
        tempCanvas.height = realHeight;

        // Ritaglia l'immagine dal video
        tempCtx.drawImage(
          video,
          realX, realY,
          realWidth, realHeight,
          0, 0,
          realWidth, realHeight
        );

        // Convertiamo in base64
        const imageBase64 = tempCanvas.toDataURL('image/jpeg', 0.95);

        detectedCards.push({
          imageBase64,
          confidence: detection.confidence,
          timestamp: new Date().toISOString()
        });
      }

      // Inviamo le immagini all'API
      await this.sendDetectedCards(detectedCards);
      
      this.addLog(`Successfully sent ${detectedCards.length} cards`);

    } catch (error) {
      this.addLog(`Error capturing/sending cards: ${error}`);
    } finally {
      this.isSending = false;
    }
  }

  private async sendDetectedCards(cards: DetectedCard[]) {
    const API_URL = 'your-api-endpoint/detected-cards';
    
    try {
      const response = await this.http.post(API_URL, { cards }).toPromise();
      return response;
    } catch (error) {
      throw new Error(`API error: ${error}`);
    }
  }

  // Modifichiamo processDetections per salvare le ultime detection
  private async processDetections(prediction: tf.Tensor, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const data = await prediction.array() as number[][][];
    const channels = data[0];
    const boxCount = channels[0].length;

    const boxesArr: number[][] = [];
    const scoresArr: number[] = [];
    const minConf = 0.5;

    // Process detections
    for (let i = 0; i < boxCount; i++) {
      const [cx, cy, w, h, conf] = channels.map(channel => channel[i]);
      
      if (conf > minConf) {
        const [xMin, yMin, xMax, yMax] = [
          cx - w / 2,
          cy - h / 2,
          cx + w / 2,
          cy + h / 2
        ];
        
        boxesArr.push([yMin, xMin, yMax, xMax]);
        scoresArr.push(conf);
      }
    }

    // Apply NMS
    const selectedIndices = await tf.image.nonMaxSuppressionAsync(
      tf.tensor2d(boxesArr),
      tf.tensor1d(scoresArr),
      20,
      0.5
    );

    const selectedIdxArray = await selectedIndices.array();
    
    // Salviamo le detection per il prossimo capture
    this.lastDetectedBoxes = selectedIdxArray.map(idx => ({
      coords: boxesArr[idx],
      confidence: scoresArr[idx]
    }));
    
    // Draw detections
    this.drawDetections(selectedIdxArray, boxesArr, scoresArr, canvas);
    
    tf.dispose(selectedIndices);
  }

  private drawDetections(
    selectedIndices: number[],
    boxes: number[][],
    scores: number[],
    canvas: HTMLCanvasElement
  ) {
    const ctx = canvas.getContext('2d')!;
    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 640;

    selectedIndices.forEach(idx => {
      const [yMin, xMin, yMax, xMax] = boxes[idx];
      const conf = scores[idx];
      
      // Scale coordinates
      const startX = xMin * scaleX;
      const startY = yMin * scaleY;
      const width = (xMax - xMin) * scaleX;
      const height = (yMax - yMin) * scaleY;

      // Draw detection box with enhanced styling
      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgba(255, 0, 0, ${conf})`;
      ctx.strokeRect(startX, startY, width, height);

      // Draw confidence label with background
      const label = `Magic Card (${(conf * 100).toFixed(1)}%)`;
      ctx.font = '60px Arial';
      const labelWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.fillRect(startX, startY - 25, labelWidth + 10, 20);
      
      ctx.fillStyle = 'white';
      ctx.fillText(label, startX + 5, startY - 10);

      // Draw corner markers
      const markerSize = 10;
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(startX, startY + markerSize);
      ctx.lineTo(startX, startY);
      ctx.lineTo(startX + markerSize, startY);
      ctx.stroke();
      
      // Top-right
      ctx.beginPath();
      ctx.moveTo(startX + width - markerSize, startY);
      ctx.lineTo(startX + width, startY);
      ctx.lineTo(startX + width, startY + markerSize);
      ctx.stroke();
      
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(startX + width, startY + height - markerSize);
      ctx.lineTo(startX + width, startY + height);
      ctx.lineTo(startX + width - markerSize, startY + height);
      ctx.stroke();
      
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(startX + markerSize, startY + height);
      ctx.lineTo(startX, startY + height);
      ctx.lineTo(startX, startY + height - markerSize);
      ctx.stroke();
    });
  }
}

class ImageProcessor {
  async enhanceFrame(video: HTMLVideoElement): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    
    // Draw original frame
    ctx.drawImage(video, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply image enhancements
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      const contrast = 1.2;
      for (let j = 0; j < 3; j++) {
        const pixel = data[i + j];
        data[i + j] = Math.min(255, ((pixel - 128) * contrast) + 128);
      }
      
      // Increase sharpness (simple implementation)
      if (i > 0 && i < data.length - 4) {
        for (let j = 0; j < 3; j++) {
          const curr = data[i + j];
          const prev = data[i - 4 + j];
          const next = data[i + 4 + j];
          data[i + j] = curr + (curr - (prev + next) / 2) * 0.5;
        }
      }
    }
    
    // Put enhanced image data back
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
  }
}