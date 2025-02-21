import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  faCamera } from '@fortawesome/free-solid-svg-icons';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-card-scan',
  templateUrl: './card-scan.component.html',
  styleUrls: ['./card-scan.component.scss']
})
export class CardScanComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  model!: tf.GraphModel;
  logs: string[] = [];  // <- Array dei messaggi di log

  faCamera = faCamera;
  
  VIDEO_WIDTH = 500;
  VIDEO_HEIGHT = 700;


  constructor() { }

  async ngOnInit() {
    this.addLog('Avvio caricamento del modello...');
    await this.loadModel();
    this.addLog('Modello caricato!');
    this.startCamera();
  }

  // Salviamo un messaggio di log sia in console che nell’array logs
  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    console.log(fullMessage);
    this.logs.push(fullMessage);
  }

  // Caricamento del modello
  async loadModel() {
    this.addLog("Caricamento modello TensorFlow.js...");
    this.model = await tf.loadGraphModel('/assets/tensorflow_model/model.json');
    this.addLog('Model Inputs:' + JSON.stringify(this.model.inputs));
    this.addLog('Model Outputs:' + JSON.stringify(this.model.outputs));

  }

  // Avvio della fotocamera
  async startCamera() {
    try {
      const constraints = { video: { facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.videoElement.nativeElement;

      video.width = this.VIDEO_WIDTH;
      video.height = this.VIDEO_HEIGHT;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play().catch(err => this.addLog("Autoplay bloccato: " + err));
        this.detectObjects();
      };
    } catch (error) {
      this.addLog("Errore nell’accesso alla fotocamera: " + error);
    }
  }

  detectObjects() {
    if (!this.model) {
      this.addLog("Modello non caricato, impossibile eseguire il detection loop!");
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = this.VIDEO_WIDTH;
    canvas.height = this.VIDEO_HEIGHT;
    const ctx = canvas.getContext('2d')!;

    setInterval(async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Prepara frame
      const inputTensor = tf.browser.fromPixels(video)
        .resizeBilinear([640, 640])  // YOLO dimension
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));

      let prediction: tf.Tensor;
      try {
        prediction = await this.model.executeAsync(inputTensor) as tf.Tensor;
        // this.addLog(`executeAsync completato, shape: ${prediction.shape}`);
      } catch (err) {
        this.addLog('Errore in executeAsync: ' + err);
        tf.dispose(inputTensor);
        return;
      }

      // Supponiamo shape [1, 5, N] con [cx, cy, w, h, conf]
      const data = prediction.arraySync() as number[][][]; // data[0] => [5, N]
      const channels = data[0]; // dimensioni => [5, N]
      // channels[0] = tutti i cx
      // channels[1] = tutti i cy
      // channels[2] = tutti i w
      // channels[3] = tutti i h
      // channels[4] = tutti i conf
      const boxCount = channels[0].length;

      // Soglia
      const minConf = 0.5;

      // Raccogliamo box e score in array per la NMS di TF.js
      const boxesArr: number[][] = [];  // form [yMin, xMin, yMax, xMax]
      const scoresArr: number[] = [];

      for (let i = 0; i < boxCount; i++) {
        const cx = channels[0][i];
        const cy = channels[1][i];
        const w = channels[2][i];
        const h = channels[3][i];
        const conf = channels[4][i];

        if (conf > minConf) {
          // Converti (cx, cy, w, h) -> (yMin, xMin, yMax, xMax)
          const xMin = cx - w / 2;
          const yMin = cy - h / 2;
          const xMax = cx + w / 2;
          const yMax = cy + h / 2;

          boxesArr.push([yMin, xMin, yMax, xMax]);
          scoresArr.push(conf);
        }
      }

      // Applichiamo NMS con IoU threshold 0.5, max 20 box
      const nmsThreshold = 0.5;
      const maxBoxes = 20;
      const boxesTensor = tf.tensor2d(boxesArr);
      const scoresTensor = tf.tensor1d(scoresArr);
      const selectedIndices = tf.image.nonMaxSuppression(
        boxesTensor, scoresTensor, maxBoxes, nmsThreshold
      );

      // Recuperiamo gli indici in un array JS
      const selectedIdxArray = selectedIndices.arraySync() as number[];

      // Disegniamo SOLO le box selezionate
      const scaleX = canvas.width / 640;
      const scaleY = canvas.height / 640;

      selectedIdxArray.forEach(idx => {
        const [yMin, xMin, yMax, xMax] = boxesArr[idx];
        const conf = scoresArr[idx];

        // Ridimensioniamo
        const startX = xMin * scaleX;
        const startY = yMin * scaleY;
        const boxWidth = (xMax - xMin) * scaleX;
        const boxHeight = (yMax - yMin) * scaleY;

        // Disegno
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, boxWidth, boxHeight);

        ctx.fillStyle = 'red';
        ctx.font = '16px Arial';
        ctx.fillText(`Carta Magic (${(conf * 100).toFixed(1)}%)`, startX, startY - 5);
      });

      // Svuota tensori per evitare memory leak
      tf.dispose([inputTensor, prediction, boxesTensor, scoresTensor, selectedIndices]);
    }, 500);
  }

}
