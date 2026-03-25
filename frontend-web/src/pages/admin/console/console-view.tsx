import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconTerminal, IconAlertTriangle, IconInfoCircle, IconX, IconFilter, IconBug } from "@tabler/icons-react"
import { orpc } from "@/lib/oprc"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LogEntry {
  level: string
  time: string
  msg: string
  [key: string]: any
}

interface ErrorEntry {
  timestamp: string
  message: string
  meta?: Record<string, any>
  environment: string
  notified: boolean
}

export function ConsoleView() {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [selectedErrorFile, setSelectedErrorFile] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<string>("all")

  const { data: logFiles = [] } = useQuery({
    queryKey: ['logFiles'],
    queryFn: () => orpc.getLogFiles()
  })

  const { data: errorFiles = [] } = useQuery({
    queryKey: ['errorFiles'],
    queryFn: () => orpc.getErrorFiles()
  })

  const { data: logContent = [], isLoading } = useQuery({
    queryKey: ['logContent', selectedFile],
    queryFn: () => orpc.getLogContent(selectedFile),
    enabled: !!selectedFile
  })

  const { data: errorContent = [], isLoading: isLoadingErrors } = useQuery({
    queryKey: ['errorContent', selectedErrorFile],
    queryFn: () => orpc.getErrorContent(selectedErrorFile),
    enabled: !!selectedErrorFile
  })

  // Filter errors based on time
  const filteredErrors = useMemo(() => {
    let filtered = [...errorContent];

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((error: ErrorEntry) => {
        const errorTime = new Date(error.timestamp);
        const diffHours = (now.getTime() - errorTime.getTime()) / (1000 * 60 * 60);
        
        switch (timeFilter) {
          case "1h":
            return diffHours <= 1;
          case "6h":
            return diffHours <= 6;
          case "24h":
            return diffHours <= 24;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [errorContent, timeFilter]);

  // Filter logs based on level and time
  const filteredLogs = useMemo(() => {
    let filtered = [...logContent];

    // Filter by level
    if (levelFilter !== "all") {
      filtered = filtered.filter((log: LogEntry) => 
        log.level?.toUpperCase() === levelFilter.toUpperCase()
      );
    }

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((log: LogEntry) => {
        const logTime = new Date(log.time);
        const diffHours = (now.getTime() - logTime.getTime()) / (1000 * 60 * 60);
        
        switch (timeFilter) {
          case "1h":
            return diffHours <= 1;
          case "6h":
            return diffHours <= 6;
          case "24h":
            return diffHours <= 24;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [logContent, levelFilter, timeFilter]);

  const getLevelColor = (level: string) => {
    const levelUpper = level?.toUpperCase()
    switch (levelUpper) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'INFO':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelIcon = (level: string) => {
    const levelUpper = level?.toUpperCase()
    switch (levelUpper) {
      case 'ERROR':
        return <IconX className="h-4 w-4" />
      case 'WARN':
        return <IconAlertTriangle className="h-4 w-4" />
      case 'INFO':
        return <IconInfoCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatTime = (time: string) => {
    try {
      return new Date(time).toLocaleString()
    } catch {
      return time
    }
  }

  const clearFilters = () => {
    setLevelFilter("all");
    setTimeFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Console</h2>
          <p className="text-sm text-muted-foreground">View application logs and error notifications</p>
        </div>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <IconTerminal className="h-4 w-4" />
            Application Logs
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <IconBug className="h-4 w-4" />
            Error Notifications
          </TabsTrigger>
        </TabsList>

        {/* Application Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          {/* Log File Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Log File</label>
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose a log file..." />
              </SelectTrigger>
              <SelectContent>
                {logFiles.map((file: string) => (
                  <SelectItem key={file} value={file}>
                    {file}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filters */}
          {selectedFile && (
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <IconFilter className="h-4 w-4" />
                  Log Level
                </label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">ERROR</SelectItem>
                    <SelectItem value="warn">WARN</SelectItem>
                    <SelectItem value="info">INFO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="1h">Last 1 Hour</SelectItem>
                    <SelectItem value="6h">Last 6 Hours</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(levelFilter !== "all" || timeFilter !== "all") && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Log Content */}
          {selectedFile && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
                <IconTerminal className="h-5 w-5" />
                <span className="font-medium text-sm">{selectedFile}</span>
                <Badge variant="outline" className="ml-auto">
                  {filteredLogs.length} / {logContent.length} entries
                </Badge>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading logs...
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <IconTerminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No logs match the current filters</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredLogs.map((log: LogEntry, index: number) => (
                      <div key={index} className="p-4 hover:bg-muted/50">
                        <div className="flex items-start gap-3">
                          <Badge className={`${getLevelColor(log.level)} border flex items-center gap-1`}>
                            {getLevelIcon(log.level)}
                            {log.level?.toUpperCase()}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(log.time)}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-2">
                              {log.msg}
                            </p>
                            {Object.keys(log).length > 3 && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                  View details
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                  {JSON.stringify(
                                    Object.fromEntries(
                                      Object.entries(log).filter(
                                        ([key]) => !['level', 'time', 'msg'].includes(key)
                                      )
                                    ),
                                    null,
                                    2
                                  )}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedFile && (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <IconTerminal className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No log file selected</p>
              <p className="text-sm">Select a log file from the dropdown above to view its contents</p>
            </div>
          )}
        </TabsContent>

        {/* Error Notifications Tab */}
        <TabsContent value="errors" className="space-y-4">
          {/* Error File Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Error File</label>
            <Select value={selectedErrorFile} onValueChange={setSelectedErrorFile}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose an error file..." />
              </SelectTrigger>
              <SelectContent>
                {errorFiles.map((file: string) => (
                  <SelectItem key={file} value={file}>
                    {file}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Filter */}
          {selectedErrorFile && (
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="1h">Last 1 Hour</SelectItem>
                    <SelectItem value="6h">Last 6 Hours</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {timeFilter !== "all" && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Error Content */}
          {selectedErrorFile && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
                <IconBug className="h-5 w-5" />
                <span className="font-medium text-sm">{selectedErrorFile}</span>
                <Badge variant="outline" className="ml-auto">
                  {filteredErrors.length} / {errorContent.length} errors
                </Badge>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {isLoadingErrors ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading errors...
                  </div>
                ) : filteredErrors.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <IconBug className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No errors match the current filters</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredErrors.map((error: ErrorEntry, index: number) => (
                      <div key={index} className="p-4 hover:bg-muted/50">
                        <div className="flex items-start gap-3">
                          <Badge className="bg-red-100 text-red-800 border-red-200 border flex items-center gap-1">
                            <IconX className="h-4 w-4" />
                            ERROR
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(error.timestamp)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {error.environment}
                              </Badge>
                              {error.notified && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  📧 Notified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium mb-2">
                              {error.message}
                            </p>
                            {error.meta && Object.keys(error.meta).length > 0 && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                  View metadata
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                  {JSON.stringify(error.meta, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedErrorFile && (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <IconBug className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No error file selected</p>
              <p className="text-sm">Select an error file from the dropdown above to view error notifications</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
