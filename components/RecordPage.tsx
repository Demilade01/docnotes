"use client";

import React from "react";

import { useSettings } from "@/lib/stores/settings";
import { useTranscriptions } from "@/lib/stores/transcriptions";
import { useClients } from "@/lib/stores/clients";

import List from "@/components/List";
import RecordButton from "@/components/RecordButton";
import KeyInput from "@/components/KeyInput";
import ClientSelector from "@/components/ClientSelector";
import { useKey } from "@/lib/stores/key";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Upload, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function RecordPage({ hasApiKey }: { hasApiKey: boolean }) {
  const key = useKey((state) => state.key);
  const dataCount = useTranscriptions((state) => state.count);
  const dataItems = useTranscriptions((state) => state.items);
  const addDataItems = useTranscriptions((state) => state.add);

  const selectedClientId = useClients((state) => state.selectedClientId);

  const minDecibels = useSettings((state) => state.minDecibels);
  const maxPause = useSettings((state) => state.maxPause);
  const language = useSettings((state) => state.language);
  const temperature = useSettings((state) => state.temperature);
  const endpoint = useSettings((state) => state.endpoint);
  const saveFile = useSettings((state) => state.saveFile);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const animFrame = React.useRef<number>(0);
  const timerCount = React.useRef<number | null>(null);

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const [sendCount, setSendCount] = React.useState(0);

  const startRef = React.useRef("default");
  const recordRef = React.useRef(false);
  const countDownRef = React.useRef(false);
  const countRef = React.useRef(0);
  const recordDateTime = React.useRef("");

  const [isReady, setReady] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [isRecording, setRecording] = React.useState(false);
  const [startState, setStartState] = React.useState("default");

  const [isCountDown, setCountDown] = React.useState(false);

  const [isMounted, setMounted] = React.useState(false);

  // UI enhancements: lightweight toast + countdown state for display
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);
  const [countMs, setCountMs] = React.useState(0);

  const checkAudioLevel = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const audioStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.maxDecibels = -10;
    analyser.minDecibels = Number(minDecibels);
    audioStreamSource.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const domainData = new Uint8Array(bufferLength);

    const detectSound = () => {
      let soundDetected = false;

      analyser.getByteFrequencyData(domainData);

      for (let i = 0; i < bufferLength; i++) {
        if (domainData[i] > 0) {
          soundDetected = true;
        }
      }

      if (soundDetected === true) {
        if (recordRef.current) {
          if (countDownRef.current) {
            setCountDown(false);
            countDownRef.current = false;
            countRef.current = 0;
          }
        } else {
          if (startRef.current === "active") {
            recordDateTime.current = new Date().toISOString();

            setRecording(true);
            recordRef.current = true;

            setCountDown(false);
            countDownRef.current = false;
            countRef.current = 0;

            if (mediaRef.current) {
              mediaRef.current.start();
            }
          }
        }
      } else {
        if (recordRef.current) {
          if (countDownRef.current) {
            if (countRef.current >= Number(maxPause)) {
              if (startRef.current === "active") {
                setRecording(false);
                recordRef.current = false;

                setCountDown(false);
                countDownRef.current = false;
                countRef.current = 0;

                if (mediaRef.current) {
                  mediaRef.current.stop();
                }
              }
            }
          } else {
            setCountDown(true);
            countDownRef.current = true;
            countRef.current = 0;
          }
        }
      }

      animFrame.current = window.requestAnimationFrame(detectSound);
    };

    animFrame.current = window.requestAnimationFrame(detectSound);
  };

  const handleStream = (stream: MediaStream) => {
    try {
      mediaRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
        mimeType: "audio/webm;codecs=opus",
      });
    } catch (error) {
      console.error(error);
      mediaRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
      });
    }
    if (!mediaRef.current) {
      setReady(true);
      checkAudioLevel(stream);
      return;
    }
    mediaRef.current.addEventListener("dataavailable", handleData);
    mediaRef.current.addEventListener("stop", handleStop);
    setReady(true);
    checkAudioLevel(stream);
  };

  const handleData = (e: { data: Blob }) => {
    chunksRef.current.push(e.data);
  };

  const handleStop = () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" });
    const name = `file${Date.now()}` + Math.round(Math.random() * 100000);
    const file = new File([blob], `${name}.webm`);

    chunksRef.current = [];

    setSendCount((prev) => prev + 1);

    sendData(name, file);
  };

  const sendData = async (name: string, file: File) => {
    console.log(key, "key");
    let formData = new FormData();
    formData.append("file", file, `${name}.webm`);
    formData.append("name", name);
    formData.append(
      "options",
      JSON.stringify({
        language,
        endpoint,
        temperature,
        saveFile,
        key,
      })
    );

    console.log("[send data]", new Date().toLocaleTimeString());

    try {
      const url = "/api/";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        signal: abortControllerRef.current?.signal,
      });

      if (response.status !== 200) {
        try {
          const result = await response.json();
          const message = `Error response ${response.status}: ${result?.error ?? "Unknown error"}`;
          setErrorMessage(message);
          setToast({ message, type: "error" });
        } catch (_e) {
          try {
            const text = await response.text();
            const message = `Error response ${response.status}: ${text || "No response body"}`;
            setErrorMessage(message);
            setToast({ message, type: "error" });
          } catch (_e2) {
            const message = `Error response ${response.status}: No response body`;
            setErrorMessage(message);
            setToast({ message, type: "error" });
          }
        }
        console.error(response);
        return;
      }

      const result = await response.json();

      console.log("[received data]", new Date().toLocaleTimeString());

      const data = result?.data;
      // Associate the transcription with the selected client
      addDataItems({
        ...data,
        clientId: selectedClientId
      });
      setErrorMessage("");
      setToast({ message: "Note saved successfully!", type: "success" });
    } catch (err) {
      setErrorMessage("Error response, see log");
      setToast({ message: "Failed to transcribe. Check logs.", type: "error" });
      console.log(err);
    } finally {
      setSendCount((prev) => prev - 1);
    }
  };

  const handleStart = () => {
    if (startRef.current === "default") {
      startRef.current = "active";

      setStartState("active");
    } else {
      if (mediaRef.current) {
        if (mediaRef.current.state !== "inactive") {
          mediaRef.current.stop();
        }
      }

      setRecording(false);
      recordRef.current = false;

      setCountDown(false);
      countDownRef.current = false;
      countRef.current = 0;

      startRef.current = "default";

      setStartState("default");
    }
  };

  React.useEffect(() => {
    abortControllerRef.current = new AbortController();
    setMounted(true);
    return () => {
      try {
        setMounted(false);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      } catch (err) {
        console.error(err);
      }
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 900);
  }, [dataCount, dataItems]);

  React.useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(handleStream)
        .catch((err) => {
          console.error(err);
          setErrorMessage("Error calling getUserMedia");
        });
    } else {
      setErrorMessage("Media devices not supported");
    }
    return () => {
      try {
        window.cancelAnimationFrame(animFrame.current);
      } catch (error) {
        console.error(error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDecibels, maxPause, language, endpoint, temperature, key]);

  React.useEffect(() => {
    if (isCountDown) {
      timerCount.current = window.setInterval(() => {
        countRef.current += 100;
        setCountMs(countRef.current);
      }, 100);
    }
    return () => {
      if (timerCount.current !== null) {
        clearInterval(timerCount.current);
        timerCount.current = null;
      }
    };
  }, [isCountDown]);

  // Auto-dismiss toast after a short delay
  React.useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Record Session Notes</h1>
            <p className="text-muted-foreground">Record audio notes for your client sessions with AI-powered transcription</p>
          </div>

          {/* Setup Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Setup & Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasApiKey && (
                <div className="space-y-2">
                  <KeyInput
                    id="open-ai-api-key"
                    label="OpenAI API Key"
                    description="Enter your OpenAI API key to enable speech-to-text transcription. For production use, set OPENAI_API_KEY in your environment variables."
                  />
                </div>
              )}

              {/* Client Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Client</label>
                <ClientSelector />
              </div>
            </CardContent>
          </Card>

          {/* Recording Section */}
          {hasApiKey || !!key ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Recording Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <RecordButton
                    disabled={!isReady || !selectedClientId}
                    isRecording={isRecording}
                    state={startState}
                    onClick={handleStart}
                    isSignalOn={sendCount > 0}
                  />
                </div>

                {/* Status Indicators */}
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant={isReady ? "default" : "secondary"} className="flex items-center gap-1">
                    {isReady ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {isReady ? "Mic Ready" : "Initializing..."}
                  </Badge>

                  {isRecording && (
                    <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                      <Mic className="h-3 w-3" />
                      Recording
                    </Badge>
                  )}

                  {sendCount > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Upload className="h-3 w-3 animate-spin" />
                      Processing...
                    </Badge>
                  )}

                  {isCountDown && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Silence: {(countMs / 1000).toFixed(1)}s
                    </Badge>
                  )}
                </div>

                {!selectedClientId && (hasApiKey || !!key) && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <MicOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Please select a client above to start recording
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Error Display */}
          {errorMessage && (
            <Card className="mb-8 border-destructive/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-destructive mt-1">{errorMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={listRef} className="max-h-96 overflow-y-auto">
                {!isReady && <div className="text-sm text-muted-foreground">{errorMessage}</div>}
                {isMounted && isReady && <List />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`min-w-[280px] rounded-lg px-4 py-3 shadow-lg border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
