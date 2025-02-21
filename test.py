import sys
import subprocess

def ensure_ultralytics_installed():
    try:
        import ultralytics
        print("Ultralytics è già installato.")
    except ImportError:
        print("Installo/aggiorno ultralytics...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "ultralytics"])

def export_yolo_to_tfjs(model_path):
    from ultralytics import YOLO
    print(f"Carico il modello: {model_path}")
    model = YOLO(model_path)
    print(f"Esporto il modello in TF.js con input fisso...")
    model.export(format="tfjs")  # NIENTE dynamic=True, NON supportato
    print("Export completato!")

def main():
    ensure_ultralytics_installed()
    model_path = "best_3.pt"  # Imposta il tuo .pt
    export_yolo_to_tfjs(model_path)

if __name__ == "__main__":
    main()
