import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Upload, X, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploaderProps {
  onImageCapture: (base64Image: string) => void;
  isAnalyzing: boolean;
}

export function ImageUploader({ onImageCapture, isAnalyzing }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback
      fileInputRef.current?.setAttribute("capture", "environment");
      fileInputRef.current?.click();
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Handle mirroring if using front camera
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset transform
        if (facingMode === "user") {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        const base64 = canvas.toDataURL("image/jpeg", 0.9);
        setPreview(base64);
        stopCamera();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        // Reset capture attribute if it was set
        fileInputRef.current?.removeAttribute("capture");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (preview) {
      onImageCapture(preview);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {!preview && !isCameraOpen ? (
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer border-2 border-dashed border-primary/30 bg-medicine-peach/50 hover:border-primary hover:bg-medicine-peach transition-all duration-300"
            onClick={startCamera}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-primary/10 p-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Take Photo</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use your camera</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer border-2 border-dashed border-accent/30 bg-medicine-mint/50 hover:border-accent hover:bg-medicine-mint transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-accent/10 p-4">
                <Upload className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Upload Image</h3>
              <p className="mt-1 text-sm text-muted-foreground">From gallery</p>
            </CardContent>
          </Card>
        </div>
      ) : isCameraOpen ? (
        <div className="space-y-4">
          <Card className="overflow-hidden bg-black/5 animate-in fade-in slide-in-from-bottom-4">
            <CardContent className="p-0 relative h-[60vh] sm:h-80 md:h-96 flex items-center justify-center bg-black rounded-lg">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/20 hover:bg-white/40 text-white border-0 shadow-sm backdrop-blur-md"
                  onClick={toggleCamera}
                >
                  <RefreshCcw className="h-5 w-5" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full shadow-sm"
                  onClick={stopCamera}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <Button 
                  size="lg" 
                  className="rounded-full h-20 w-20 p-0 border-4 border-white/80 bg-transparent hover:bg-white/20 transition-all shadow-lg backdrop-blur-sm"
                  onClick={captureImage}
                >
                  <div className="h-16 w-16 rounded-full bg-white transition-transform active:scale-95" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <Card className="overflow-hidden shadow-md">
            <CardContent className="p-0 relative bg-muted/30">
              <img 
                src={preview!} 
                alt="Medicine preview" 
                className="w-full h-64 md:h-80 object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 rounded-full shadow-sm"
                onClick={handleClear}
                disabled={isAnalyzing}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Medicine...
              </>
            ) : (
              "Analyze Medicine"
            )}
          </Button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
