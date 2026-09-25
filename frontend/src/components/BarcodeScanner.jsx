import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";

const BarcodeScanner = ({ onDetected, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const lastDetectedAtRef = useRef(0);
  const onDetectedRef = useRef(onDetected);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [scanState, setScanState] = useState("Starting camera...");
  const [retryToken, setRetryToken] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  const scanPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setProcessing(true);
    setError("");
    setScanState("Processing barcode image...");

    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);
    const imageUrl = URL.createObjectURL(file);
    try {
      const result = await reader.decodeFromImageUrl(imageUrl);
      const value = result?.getText()?.trim();
      if (value) {
        setScanState("Barcode found");
        onDetectedRef.current(value);
        setScanState("Searching for the next barcode...");
      } else {
        setError("No barcode was found in that photo. Crop closer and try again.");
        setScanState("Scan failed");
      }
    } catch {
      setError("No barcode was found in that photo. Crop closer and try again.");
      setScanState("Scan failed");
    } finally {
      URL.revokeObjectURL(imageUrl);
      setProcessing(false);
    }
  };

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 200,
      delayBetweenScanSuccess: 1000,
    });
    const frameReader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 150,
    });
    const scanCooldown = 1200;
    let mounted = true;
    let readinessTimer;
    let frameTimer;

    const handleResult = (result) => {
      if (!mounted || !result || typeof result.getText !== "function") {
        return;
      }

      const value = result.getText().trim();
      if (!value) return;

      const now = Date.now();
      if (now - lastDetectedAtRef.current < scanCooldown) return;

      lastDetectedAtRef.current = now;
      setScanState("Processing barcode...");
      setProcessing(true);
      window.setTimeout(() => {
        if (mounted) {
          onDetectedRef.current(value);
          setProcessing(false);
          setScanState("Searching for the next barcode...");
        }
      }, 250);
    };

    const startScanner = async () => {
      try {
        if (!videoRef.current) return;

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const preferredDevice = devices.find((device) =>
          /back|rear|environment|camera 2/i.test(device.label),
        );
        const deviceId = preferredDevice?.deviceId || devices[0]?.deviceId;

        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          videoRef.current,
          handleResult,
        );

        if (mounted) {
          controlsRef.current = controls;
          frameTimer = window.setInterval(() => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) {
              return;
            }

            // Decode an enlarged crop matching the visible scan frame. This
            // removes surrounding packaging text and gives narrow bars more pixels.
            const cropWidth = Math.floor(video.videoWidth * 0.8);
            const cropHeight = Math.floor(video.videoHeight * 0.55);
            const cropX = Math.floor((video.videoWidth - cropWidth) / 2);
            const cropY = Math.floor((video.videoHeight - cropHeight) / 2);
            const scale = 2;

            canvas.width = cropWidth * scale;
            canvas.height = cropHeight * scale;
            const context = canvas.getContext("2d", { willReadFrequently: true });
            context.drawImage(
              video,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              canvas.width,
              canvas.height,
            );

            try {
              handleResult(frameReader.decodeFromCanvas(canvas));
            } catch {
              // Try the complete frame as a fallback when the barcode is outside
              // the center of the guide.
              canvas.width = video.videoWidth * scale;
              canvas.height = video.videoHeight * scale;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              try {
                handleResult(frameReader.decodeFromCanvas(canvas));
              } catch {
                // A frame without a complete barcode is expected while scanning.
              }
            }
          }, 350);
          readinessTimer = window.setTimeout(() => {
            const video = videoRef.current;
            if (!video || video.readyState < 2 || video.videoWidth === 0) {
              setError("The camera opened but is not sending video. Close other camera apps and try again.");
              setScanState("Camera unavailable");
            }
          }, 8000);
        } else {
          controls.stop();
        }
      } catch (scannerError) {
        if (mounted) {
          setError(
            scannerError?.name === "NotAllowedError"
              ? "Camera access was blocked. Allow camera access or enter the SKU manually."
              : "Unable to start the camera. Check that your device has a camera and try again.",
          );
          setScanState("Camera error");
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
      videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
      window.clearTimeout(readinessTimer);
      window.clearInterval(frameTimer);
    };
  }, [retryToken]);

  return (
    <div className="scanner-backdrop" role="presentation">
      <section className="scanner-modal" role="dialog" aria-modal="true" aria-labelledby="scanner-title">
        <div className="scanner-header">
          <div>
            <p className="eyebrow">Barcode entry</p>
            <h2 id="scanner-title">Scan product barcode</h2>
          </div>
          <button type="button" className="scanner-close" onClick={onClose} aria-label="Close barcode scanner">
            ×
          </button>
        </div>

        <div className="scanner-preview">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onCanPlay={() => {
              if (videoRef.current?.videoWidth > 0) {
                setCameraReady(true);
                setScanState("Searching for barcode...");
                setError("");
              }
            }}
          />
          <canvas ref={canvasRef} className="scanner-canvas" aria-hidden="true" />
          <span className="scanner-frame" aria-hidden="true" />
          <span className={`scanner-status ${cameraReady ? "scanner-status-ready" : ""}`}>
            <span className="scanner-status-dot" />
            {processing ? "Processing scan..." : cameraReady ? scanState : "Starting camera..."}
          </span>
        </div>

        {error ? (
          <>
            <p className="scanner-error" role="alert">{error}</p>
            <button
              type="button"
              className="scanner-retry"
              onClick={() => {
                setError("");
                setCameraReady(false);
                setScanState("Starting camera...");
                setRetryToken((token) => token + 1);
              }}
            >
              Retry camera
            </button>
          </>
        ) : (
          <p className="scanner-help">
            Hold the barcode inside the blue frame, keep it well lit, and move closer until it is sharp.
          </p>
        )}

        <label className={`scanner-photo-button ${processing ? "scanner-photo-disabled" : ""}`}>
          {processing ? "Processing scan..." : "Scan a barcode photo"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={scanPhoto}
            disabled={processing}
          />
        </label>

        <button type="button" className="scanner-cancel" onClick={onClose}>
          Done scanning
        </button>
      </section>
    </div>
  );
};

export default BarcodeScanner;
