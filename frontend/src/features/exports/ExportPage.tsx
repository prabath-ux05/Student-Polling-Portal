import { useState } from 'react'
import { downloadCSV, downloadPDF } from '@/api/exports'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react'

export default function ExportPage() {
  const [csvLoading, setCsvLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [csvDone, setCsvDone] = useState(false)
  const [pdfDone, setPdfDone] = useState(false)

  const handleCSV = async () => {
    setCsvLoading(true)
    setCsvDone(false)
    try {
      await downloadCSV()
      setCsvDone(true)
      setTimeout(() => setCsvDone(false), 3000)
    } finally {
      setCsvLoading(false)
    }
  }

  const handlePDF = async () => {
    setPdfLoading(true)
    setPdfDone(false)
    try {
      await downloadPDF()
      setPdfDone(true)
      setTimeout(() => setPdfDone(false), 3000)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Export Data</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Download student responses in your preferred format
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
        {/* CSV Export */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-7 h-7 text-success" />
            </div>
            <CardTitle className="text-lg">CSV Export</CardTitle>
            <CardDescription>Spreadsheet-compatible format for Excel, Google Sheets</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleCSV} disabled={csvLoading} className="w-full" variant={csvDone ? 'secondary' : 'default'}>
              {csvLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : csvDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* PDF Export */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <FileText className="w-7 h-7 text-destructive" />
            </div>
            <CardTitle className="text-lg">PDF Report</CardTitle>
            <CardDescription>Formatted document for printing and archival</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handlePDF} disabled={pdfLoading} className="w-full" variant={pdfDone ? 'secondary' : 'default'}>
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : pdfDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
