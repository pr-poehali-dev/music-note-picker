import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AudioFile {
  id: string;
  name: string;
  duration: number;
  processed: boolean;
}

const Index = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([
    { id: '1', name: 'Песня_1.mp3', duration: 245, processed: true },
    { id: '2', name: 'Джем_сессия.wav', duration: 367, processed: true },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    setProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          
          const newFiles = files.map((file, index) => ({
            id: Date.now().toString() + index,
            name: file.name,
            duration: Math.floor(Math.random() * 300) + 60,
            processed: true,
          }));
          setAudioFiles(prev => [...newFiles, ...prev]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name="Music" className="text-primary" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">NoteFinder</h1>
              <p className="text-sm text-muted-foreground">Распознавание нот для гитары</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="HelpCircle" size={20} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            <Card
              className={`glass-effect border-2 transition-all duration-300 ${
                isDragging ? 'border-primary bg-primary/5' : 'border-dashed border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-12 text-center space-y-4">
                <div className="flex justify-center">
                  <div className={`p-6 rounded-full bg-primary/10 ${processing ? 'animate-pulse-glow' : ''}`}>
                    <Icon name="Upload" className="text-primary" size={48} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Загрузите аудиофайл</h3>
                  <p className="text-muted-foreground mb-4">
                    Перетащите MP3, WAV или FLAC файл сюда или нажмите кнопку
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="audio/*"
                    multiple
                    onChange={handleFileInput}
                  />
                  <label htmlFor="file-upload">
                    <Button className="cursor-pointer" asChild>
                      <span>
                        <Icon name="FolderOpen" size={18} className="mr-2" />
                        Выбрать файлы
                      </span>
                    </Button>
                  </label>
                </div>

                {processing && (
                  <div className="space-y-2 pt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      Обработка аудио... {progress}%
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="glass-effect p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="Radio" className="text-secondary" size={20} />
                  Редактор нот
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">E стандарт</Badge>
                    <Badge variant="outline">120 BPM</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((string, idx) => (
                      <div key={string} className="flex items-center gap-4">
                        <span className="text-xs font-mono text-muted-foreground w-4">
                          {['E', 'B', 'G', 'D', 'A', 'E'][idx]}
                        </span>
                        <div className="flex-1 h-8 bg-background/50 rounded relative border border-border/50">
                          <div className="absolute inset-0 flex items-center">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 border-r border-border/30 h-full relative group cursor-pointer hover:bg-primary/10 transition-colors"
                              >
                                {i % 4 === 0 && (
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-2 border-primary-foreground shadow-lg flex items-center justify-center text-xs font-bold">
                                    {[3, 5, 7, 5, 8, 3][idx]}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex gap-2 mb-3">
                    <Icon name="Waveform" className="text-primary" size={20} />
                    <span className="text-sm font-medium">Waveform</span>
                  </div>
                  <div className="flex items-end gap-1 h-20">
                    {Array.from({ length: 80 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 waveform-gradient rounded-t animate-waveform"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.02}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Library" className="text-accent" size={20} />
                Библиотека
              </h2>
              
              <Tabs defaultValue="recent">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="recent" className="flex-1">
                    <Icon name="Clock" size={16} className="mr-2" />
                    Недавние
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="flex-1">
                    <Icon name="Star" size={16} className="mr-2" />
                    Избранное
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-2">
                  {audioFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-primary/10">
                          <Icon name="FileAudio" className="text-primary" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDuration(file.duration)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon name="Play" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="favorites" className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="Star" className="text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">Нет избранных записей</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="glass-effect p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Gauge" className="text-secondary" size={20} />
                Статистика
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Обработано файлов</span>
                  <span className="text-lg font-bold">{audioFiles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Распознано нот</span>
                  <span className="text-lg font-bold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Точность</span>
                  <Badge variant="secondary">94%</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
