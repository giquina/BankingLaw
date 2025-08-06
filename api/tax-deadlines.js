/**
 * Vercel API Endpoint - Tax Deadlines
 * Educational tax deadline tracker for financial disputes
 */

import { hmrcKnowledgeHub } from '../src/hmrc-integration.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600'); // 24 hour cache

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('📅 Tax Deadlines API called');
    
    const deadlines = await hmrcKnowledgeHub.getTaxDeadlines();
    
    res.status(200).json({
      success: true,
      data: deadlines,
      timestamp: new Date().toISOString(),
      source: 'HMRC Official Deadlines',
      educationalNote: 'Educational deadline tracker - verify current dates with HMRC'
    });
    
  } catch (error) {
    console.error('❌ Tax Deadlines API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Unable to fetch tax deadlines',
      timestamp: new Date().toISOString()
    });
  }
}