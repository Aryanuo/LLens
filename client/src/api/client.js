import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minute timeout for Gemini processing
});

export async function analyzeReport(file, language = 'en', reportDate = '') {
  const formData = new FormData();
  formData.append('report', file);
  formData.append('language', language);
  if (reportDate) formData.append('reportDate', reportDate);

  const response = await api.post('/reports/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getReports() {
  const response = await api.get('/reports');
  return response.data;
}

export async function getReport(id) {
  const response = await api.get(`/reports/${id}`);
  return response.data;
}

export async function deleteReport(id) {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
}

export async function sendChatMessage(reportId, question, language = 'en', reportContext = null) {
  const response = await api.post('/chat', { reportId, question, language, reportContext });
  return response.data;
}

export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}
