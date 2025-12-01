// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box, Container, Toolbar, Typography, Paper, TextField,
  Button, CircularProgress, Alert, Chip, Accordion,
  AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/Upload';
import SearchIcon from '@mui/icons-material/Search';
import PolicyIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';

// Custom components
import NavBar from './components/NavBar';
import DocumentUpload from './components/DocumentUpload';
import QueryHistory from './components/QueryHistory';
import PolicyVisualizer from './components/PolicyVisualizer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('query');

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://api.yourservice.com/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!res.ok) throw new Error('Processing failed');
      
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            
            <Container maxWidth="lg">
              {activeTab === 'query' && (
                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    Insurance Policy Query System
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Enter your query in natural language to analyze policy coverage
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Enter your query (e.g., '46M, knee surgery, Pune, 3-month policy')"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      multiline
                      rows={3}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SearchIcon />}
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{ height: 'fit-content', alignSelf: 'center' }}
                    >
                      Analyze
                    </Button>
                  </Box>
                  
                  {loading && (
                    <Box sx={{ display: 'flex', justifyContent:'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {response && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        Query Results
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Chip
                          label={`Decision: ${response.decision}`}
                          color={response.decision === 'Approved' ? 'success' : 'error'}
                          variant="outlined"
                          size="medium"
                        />
                        {response.amount && (
                          <Chip
                            label={`Amount: ₹${response.amount}`}
                            color="info"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        {response.summary}
                      </Typography>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="h6" gutterBottom>
                        Justification
                      </Typography>
                      
                      {response.justification.map((item: any, index: number) => (
                        <Accordion key={index} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              <strong>{item.clause_title}</strong> (Relevance: {Math.round(item.relevance_score * 100)}%)
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                              {item.clause_text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Document: {item.document_name} | Page: {item.page_number}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  )}
                </Paper>
              )}
              
              {activeTab === 'upload' && <DocumentUpload />}
              {activeTab === 'history' && <QueryHistory />}
              {activeTab === 'policies' && <PolicyVisualizer />}
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;